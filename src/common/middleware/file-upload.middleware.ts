// file-upload.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as multer from 'multer';
import * as path from 'path';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    const storage = multer.diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 }, // Giới hạn dung lượng 1MB
      fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          return cb(new Error('Only images with extensions .jpeg, .jpg or .png are allowed.'));
        }
      },
    }).single('image');

    upload(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  }
}
