import { appRepository } from "@/lib/data/repositoryFactory";

export const customizationService = {
  createRequest: (payload: {
    fullName: string;
    email: string;
    instrument: string;
    message: string;
  }) => appRepository.customizationRequests.create(payload),
};
