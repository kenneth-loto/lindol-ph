import * as v from "valibot";

export const USGSFeatureSchema = v.object({
  id: v.string(),
  properties: v.object({
    mag: v.nullable(v.number()),
    place: v.string(),
    time: v.number(),
  }),
  geometry: v.object({
    coordinates: v.tuple([v.number(), v.number(), v.number()]),
  }),
});

export const USGSResponseSchema = v.object({
  features: v.array(USGSFeatureSchema),
});

export type USGSFeature = v.InferOutput<typeof USGSFeatureSchema>;
export type USGSResponse = v.InferOutput<typeof USGSResponseSchema>;
