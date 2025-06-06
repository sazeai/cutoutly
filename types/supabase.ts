export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cutoutly_cartoons: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: string
          progress_stage: string
          progress_percent: number
          input_image_url: string
          generated_image_url: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?: string
          progress_stage?: string
          progress_percent?: number
          input_image_url: string
          generated_image_url?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: string
          progress_stage?: string
          progress_percent?: number
          input_image_url?: string
          generated_image_url?: string | null
          error_message?: string | null
        }
      }
      cutoutly_saved_faces: {
        Row: {
          id: string
          created_at: string
          user_id: string
          image_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          image_url: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          image_url?: string
        }
      }
      cutoutly_saved_profile_faces: {
        Row: {
          id: string
          created_at: string
          user_id: string
          image_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          image_url: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          image_url?: string
        }
      }
      cutoutly_avatars: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: string
          progress_stage: string
          progress_percent: number
          input_image_url: string
          generated_image_url: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?: string
          progress_stage?: string
          progress_percent?: number
          input_image_url: string
          generated_image_url?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: string
          progress_stage?: string
          progress_percent?: number
          input_image_url?: string
          generated_image_url?: string | null
          error_message?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
