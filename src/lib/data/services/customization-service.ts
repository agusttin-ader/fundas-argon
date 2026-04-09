import { appRepository } from "@/lib/data/repositoryFactory";

export const customizationService = {
  createRequest: (payload: {
    fullName: string;
    email: string;
    instrument: string;
    message: string;
    imageUrls?: string[];
  }) => appRepository.customizationRequests.create(payload),
};
