import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UUID } from '../types/common.types';

// INITIALIZE USER SERVICE
const userService = new UserService();

export const UserController = {
  // DELETE USER
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF ID IS PROVIDED
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // DELETE USER
      const deletedUser = await userService.deleteUser(id as UUID);

      // IF USER DOES NOT EXIST
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // RETURN RESPONSE
      return res.status(204).json();
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
