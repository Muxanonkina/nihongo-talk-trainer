import { Router } from 'express';
import * as dialogController from './dialog.controller';

const router = Router();

router.get('/', dialogController.getAllDialogs);
router.get('/:id', dialogController.getDialogById);

export default router;
