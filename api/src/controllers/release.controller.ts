import { Request, Response } from "express";
import { ReleaseService } from "../services/release.service";
import { AuthenticatedRequest } from "../types/auth.type";
import { UUID } from "crypto";
import { generateCatalogNumber } from "../helpers/strings.helper";
import moment from "moment";

// INTITIALIZE RELEASE SERVICE
const releaseService = new ReleaseService();

export const ReleaseController = {

    // CREATE RELEASE
    async createRelease(req: Request, res: Response) {
        try {
            const {
              title,
              upc,
              releaseDate,
              version = 'original',
              productionYear,
              labelId,
            } = req.body;
            const { user } = req as AuthenticatedRequest;

            // CHECK IF REQUIRED FIELDS ARE PROVIDED
            if (!title || !releaseDate || !productionYear) {
                return res.status(400).json({ message: "Title, release date, and production year are required" });
            }

            // CHECK IF LABEL EXISTS
            const labelExists = await releaseService.checkIfLabelExists({
                labelId: labelId as UUID,
                productionYear,
                releaseDate: moment(releaseDate).format(),
                title,
                userId: user.id as UUID,
                version,
            });

            // RETURN ERROR IF LABEL EXISTS
            if (labelExists) {
                return res.status(409).json({
                    message: "Release already exists",
                    data: {
                        id: labelExists.id,
                    }
                });
            }

            // CREATE RELEASE
            const newRelease = await releaseService.createRelease({
              title,
              upc,
              releaseDate: moment(releaseDate).format(),
              version,
              productionYear,
              catalogNumber: generateCatalogNumber(productionYear),
              labelId: labelId as UUID,
              userId: user.id as UUID,
            });

            // RETURN RESPONSE
            return res.status(201).json({
                message: "Release created successfully",
                data: newRelease,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },

    // FETCH RELEASES
    async fetchReleases(req: Request, res: Response) {

      const { user } = req as AuthenticatedRequest;

      const {
        size = 10,
        page = 0,
        labelId = undefined,
        userId = undefined,
      } = req.query;

      // INITIALIZE CONDITION
      let condition: object = {
        userId: user.role !== 'admin' ? (userId as UUID) || user.id : null,
        labelId: labelId && (labelId as UUID),
      };

      try {
        // FETCH RELEASES
        const releases = await releaseService.fetchReleases({
          size: Number(size),
          page: Number(page),
          condition,
        });
        return res.status(200).json({
          message: 'Releases fetched successfully',
          data: releases,
        });
      } catch (error: any) {
        return res.status(500).json({
          message: error.message,
        });
      }
    },

    // GET SINGLE RELEASE
    async getRelease(req: Request, res: Response) {
        const { id } = req.params;
        try {
            // FETCH RELEASE
            const release = await releaseService.getReleaseById(id as UUID);

            // IF RELEASE DOES NOT EXIST
            if (!release) {
                return res.status(404).json({
                    message: 'Release not found',
                });
            }

            // RETURN RESPONSE
            return res.status(200).json({
                message: 'Release fetched successfully',
                data: release,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },
}