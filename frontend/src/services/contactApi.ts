import { api } from "@/lib/api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const submitContactForm = async (formData: ContactFormData): Promise<{ message: string; contact: Contact }> => {
  const { data } = await api.post("/contact", formData);
  return data;
};

export const getAllContacts = async (): Promise<Contact[]> => {
  const { data } = await api.get("/contact");
  return data;
};