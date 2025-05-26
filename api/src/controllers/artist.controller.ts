import { Request, Response } from 'express';
import { ArtistService } from '../services/artist.service';
import { AuthenticatedRequest } from '../types/auth.type';
import { UUID } from 'crypto';
import { ROLES } from '../constants/auth.constant';
import { STATUSES } from '../constants/artist.constants';

// INITIALIZE ARTIST SERVICE
const artistService = new ArtistService();

export const ArtistController = {
  // CREATE ARTIST
  async createArtist(req: Request, res: Response) {
    try {
      const { name, status } = req.body;
      const { user } = req as AuthenticatedRequest;

      // CHECK IF REQUIRED FIELDS ARE PROVIDED
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      // CREATE ARTIST
      const newArtist = await artistService.createArtist({
        name,
        status,
        userId: user?.id as UUID,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Artist created successfully',
        data: newArtist,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // FETCH ARTISTS
  async fetchArtists(req: Request, res: Response) {
    try {
      const { size = 10, page = 0, labelId } = req.query;
      const { user } = req as AuthenticatedRequest;
      let condition: object = {};

      // IF USER IS NOT ADMIN
      if (user?.role !== ROLES.ADMIN) {
        condition = {
          ...condition,
          userId: user?.id as UUID,
          status: STATUSES.ACTIVE,
        };
      }

      // IF LABEL ID IS PROVIDED
      if (labelId) {
        condition = { ...condition, labelId: labelId as UUID };
      }

      // FETCH ARTISTS
      const artists = await artistService.fetchArtists({
        condition: condition,
        size: Number(size),
        page: Number(page),
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Artists fetched successfully',
        data: artists,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // GET ARTIST BY ID
  async getArtistById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;

      // FETCH ARTIST BY ID
      const artist = await artistService.getArtistById(id as UUID);

      // IF USER IS NOT ADMIN AND ARTIST IS NOT ACTIVE
      if (user?.role !== ROLES.ADMIN && artist?.status !== STATUSES.ACTIVE) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Artist fetched successfully',
        data: artist,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // UPDATE ARTIST
  async updateArtist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const { user } = req as AuthenticatedRequest;

      // CHECK IF REQUIRED FIELDS ARE PROVIDED
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      // FETCH ARTIST BY ID
      const artist = await artistService.getArtistById(id as UUID);

      // IF ARTIST DOES NOT EXIST
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      // IF USER IS NOT ADMIN AND ARTIST IS NOT ACTIVE
      if (user?.role !== ROLES.ADMIN && artist?.status !== STATUSES.ACTIVE) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // UPDATE ARTIST
      const updatedArtist = await artistService.updateArtist({
        id: id as UUID,
        name: name || (artist?.name as string),
        status: status || (artist?.status as string),
        userId: artist?.userId as UUID,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Artist updated successfully',
        data: updatedArtist,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // DELETE ARTIST
  async deleteArtist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;

      // IF USER IS NOT ADMIN AND DID NOT CREATE THE ARTIST
      if (user?.role !== ROLES.ADMIN && user?.id !== id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // DELETE ARTIST
      await artistService.deleteArtist(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({ message: 'Artist deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
