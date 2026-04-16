import { Request, Response } from 'express';
import prisma from '../utils/prisma';


export const getDiseasesByCrop = async (req: Request, res: Response) => {
  const { cropName } = req.params;
  try {
    const crop = await prisma.referenceCrop.findFirst({
      where: {
        name: { equals: cropName, mode: 'insensitive' },
      },
      include: {
        diseases: {
          include: { treatments: true },
        },
      },
    });

    if (!crop) {
      return res.status(404).json({ message: `No data found for crop: ${cropName}` });
    }

    res.json({
      crop: crop.name,
      diseases: crop.diseases,
    });
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDiseaseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const disease = await prisma.disease.findUnique({
      where: { id: Number(id) },
      include: { treatments: true, crop: true },
    });

    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json(disease);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};