import { z } from 'zod'

const PhotosSchema = z.array(z.string().min(1)).min(1).max(3)

export const JournalCreateSchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.string().min(1).max(40),
  moodColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  note: z.string().max(500).optional().default(''),
  photos: PhotosSchema,
})

export const JournalUpdateSchema = z
  .object({
    entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    mood: z.string().min(1).max(40).optional(),
    moodColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    note: z.string().max(500).optional(),
    photos: PhotosSchema.optional(),
  })
  .refine((v) => Object.values(v).some((value) => value !== undefined), {
    message: 'At least one journal field is required',
  })

export const JournalIdSchema = z.object({
  id: z.string().min(1),
})

export const JournalSchema = z.object({
  id: z.string(),
  entryDate: z.string(),
  mood: z.string(),
  moodColor: z.string(),
  note: z.string(),
  photos: PhotosSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type JournalCreateInput = z.infer<typeof JournalCreateSchema>
export type JournalUpdateInput = z.infer<typeof JournalUpdateSchema>
export type JournalIdParam = z.infer<typeof JournalIdSchema>
