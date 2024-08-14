import type { NextApiRequest, NextApiResponse } from 'next';
import { TagService } from '@/services/tagService';
import { TagController } from '@/controllers/tagController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

const tagService = new TagService();
const tagController = new TagController(tagService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialise la source de données avant de traiter la requête
    await initializeDataSource();

    // Applique la configuration CORS
    await Cors(req, res, {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000'
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
   

    // Gestion des différentes méthodes HTTP
    switch (req.method) {
      case 'GET':
        // Vérifie si la requête concerne un tag spécifique par ID ou tous les tags
        if (req.query.tag_uuid) {
          return tagController.getTagById(req, res);
        } else {
          return tagController.getAllTags(req, res);
        }
      case 'POST':
        return tagController.createTag(req, res);
      case 'PUT':
        return tagController.updateTag(req, res);
      case 'DELETE':
        return tagController.deleteTag(req, res);
      default:
        // Méthodes non autorisées
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
