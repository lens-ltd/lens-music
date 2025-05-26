import { Request, Response } from 'express';
import { LabelService } from '../services/label.service';
import { AuthenticatedRequest } from '../types/auth.type';
import { validateCountry, validateEmail } from '../helpers/validations.helper';
import { UUID } from '../types/common.types';

// INITIALIZE LABEL SERVICE
const labelService = new LabelService();

export const LabelController = {
  // CREATE LABEL
  async createLabel(req: Request | AuthenticatedRequest, res: Response) {
    try {
      // GET USER FROM REQUEST
      const { user } = req as AuthenticatedRequest;

      const { name, description, email, country } = req.body;

      // CHECK IF NAME IS PROVIDED
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      // VALIDATE EMAIL IF PROVIDED
      if (email) {
        const { error } = validateEmail(email);
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      // VALIDATE COUNTY IF PROVIDED
      if (country) {
        const countryIsValid = validateCountry(country);

        if (!countryIsValid) {
          return res.status(400).json({ message: 'Invalid country value' });
        }
      }

      // CREATE LABEL
      const label = await labelService.createLabel({
        name,
        description,
        email,
        userId: user.id as UUID,
        country,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Label created successfully',
        data: label,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // UPDATE LABEL
  async updateLabel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, email, country } = req.body;

      // CHECK IF ID IS PROVIDED
      if (!id) {
        return res.status(400).json({ message: 'Label ID is required' });
      }

      // VALIDATE EMAIL IF PROVIDED
      if (email) {
        const { error } = validateEmail(email);
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      // VALIDATE COUNTY IF PROVIDED
      if (country) {
        const countryIsValid = validateCountry(country);

        if (!countryIsValid) {
          return res.status(400).json({ message: 'Invalid country value' });
        }
      }

      // CHECK IF LABEL EXISTS
      const labelExists = await labelService.getLabelById(id as UUID);

      // IF LABEL NOT FOUND
      if (!labelExists) {
        return res.status(404).json({ message: 'Label not found' });
      }

      // UPDATE LABEL
      const updatedLabel = await labelService.updateLabel({
        id: id as UUID,
        name,
        description,
        email,
        country,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Label updated successfully',
        data: updatedLabel,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // DELETE LABEL
  async deleteLabel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF ID IS PROVIDED
      if (!id) {
        return res.status(400).json({ message: 'Label ID is required' });
      }

      // CHECK IF LABEL EXISTS
      const labelExists = await labelService.getLabelById(id as UUID);

      // IF LABEL NOT FOUND
      if (!labelExists) {
        return res.status(404).json({ message: 'Label not found' });
      }

      // DELETE LABEL
      await labelService.deleteLabel(id);

      // RETURN RESPONSE
      return res.status(204).json();
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // LIST LABELS
  async fetchLabels(req: Request, res: Response) {
    try {
      const { size = 10, page = 0 } = req.query;

      // LIST LABELS
      const labels = await labelService.fetchLabels({
        size: Number(size),
        page: Number(page),
        condition: { ...req.query, size: undefined, page: undefined },
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Labels returned successfully',
        data: labels,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // GET LABEL
  async getLabel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF ID IS PROVIDED
      if (!id) {
        return res.status(400).json({ message: 'Label ID is required' });
      }

      // GET LABEL
      const label = await labelService.getLabelById(id as UUID);

      // IF LABEL NOT FOUND
      if (!label) {
        return res.status(404).json({ message: 'Label not found' });
      }

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Label found successfully',
        data: label,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
