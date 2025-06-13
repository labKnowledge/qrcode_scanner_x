import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import { connectToDatabase } from "@/utils/database";
import { ProcessingLogs } from "@/models/ProcessingLog";

// Rate limiting map (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: Request): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 10) {
    // 10 requests per minute
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 },
      );
    }

    // Validate file type and size
    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json(
        { success: false, error: "File too large" },
        { status: 400 },
      );
    }

    // Dynamic import of jsQR for better server-side compatibility
    const jsQR = (await import("jsqr")).default;

    // Process the image
    const buffer = Buffer.from(await file.arrayBuffer());
    let image;

    try {
      image = await loadImage(buffer);
    } catch (imageError) {
      console.error("Failed to load image:", imageError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to load image. Please check the file format.",
        },
        { status: 400 },
      );
    }

    // Calculate optimal size for QR code detection
    // QR codes work best when the finder patterns are about 10-15 pixels wide
    const MIN_FINDER_PATTERN_SIZE = 10;
    const MAX_FINDER_PATTERN_SIZE = 15;

    // Estimate QR code size (assuming it takes up about 1/3 of the image)
    const estimatedQRSize = Math.min(image.width, image.height) / 3;
    const scale = Math.min(
      MAX_FINDER_PATTERN_SIZE / (estimatedQRSize / 7), // 7 is the number of modules in a finder pattern
      Math.max(1, MIN_FINDER_PATTERN_SIZE / (estimatedQRSize / 7)),
    );

    const width = Math.floor(image.width * scale);
    const height = Math.floor(image.height * scale);

    // Create canvas and process image
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    if (!context) {
      return NextResponse.json(
        { success: false, error: "Failed to get canvas context" },
        { status: 500 },
      );
    }

    // Draw image with white background for better contrast
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Use high-quality image scaling for better QR detection
    context.imageSmoothingEnabled = true;
    context.drawImage(image, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);

    // Try multiple detection attempts with different options
    let code = null;

    // First attempt: don't invert
    code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    // Second attempt: try inverting if first failed
    if (!code) {
      code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "onlyInvert",
      });
    }

    // Third attempt: try both if still failed
    if (!code) {
      code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });
    }

    const processingTime = performance.now() - startTime;
    let result;

    if (code) {
      result = {
        success: true,
        content: code.data,
      };
    } else {
      result = {
        success: false,
        error: "No QR code found in the image",
      };
    }

    // Log the processing attempt (async, don't block response)
    setImmediate(async () => {
      try {
        await connectToDatabase();
        const log = new ProcessingLogs({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          processingTime,
          success: result.success,
          errorMessage: result.error,
          qrCodeContent: result.success ? result.content : undefined,
          timestamp: new Date(),
          ipAddress: getRateLimitKey(request),
        });
        await log.save();
      } catch (logError) {
        console.warn("Failed to log processing attempt:", logError);
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing QR code:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to process image: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    );
  }
}
