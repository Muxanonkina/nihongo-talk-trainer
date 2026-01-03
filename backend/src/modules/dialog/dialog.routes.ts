import { Router } from 'express';
import * as dialogController from './dialog.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, dialogController.getAllDialogs);
router.get('/:id', authenticate, dialogController.getDialogById);

export default router;
