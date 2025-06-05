import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

// Define params as a Promise
type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const supabase = await createClient();
    const { id: avatarId } = await params; // Await params to resolve id

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the avatar
    const { data: avatar, error } = await supabase
      .from("cutoutly_avatars")
      .select("*")
      .eq("id", avatarId)
      .eq("user_id", user.id)
      .single();

    if (error || !avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // If avatar is completed, include the output URL
    if (avatar.status === "completed" && avatar.output_image_path) {
      const { data } = supabase.storage
        .from("cutoutly")
        .getPublicUrl(avatar.output_image_path);

      return NextResponse.json({
        ...avatar,
        outputUrl: data.publicUrl, // Access publicUrl directly
      });
    }

    return NextResponse.json(avatar);
  } catch (error) {
    console.error("Error in avatar API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}