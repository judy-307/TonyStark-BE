import { NextFunction, Request, Response } from 'express';
import logger from '../core/logger';
import { Product } from '../models/product';

const productApiController = {
  listing: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('retrieving product listing');
    let size: number = Number(req.query.size);
    if (Number.isNaN(size)) {
      size = 10;
    }
    if (size <= 0) {
      size = 10;
    } else if (size > 100) {
      size = 100;
    }
    let page: number = Number(req.query.page);
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (page <= 0) {
      page = 1;
    }
    let sort: string = String(req.query.sort);
    if (sort === 'undefined') {
      sort = 'id';
    }
    let dir: string = String(req.query.dir);
    if (dir === 'undefined') {
      dir = 'asc';
    }
    Product.findAndCountAll({
      offset: (page - 1) * size,
      limit: size,
      order: [[sort, dir]],
    })
      .then((result) => {
        if (result.rows) {
          res.status(200).json(result.rows);
        } else {
          res.status(200).json([]);
        }
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        res.status(422).json({
          status: false,
          message: 'Fail retrieving data!',
          error: err,
        });
      });
  },

  retrieveByCode: (req: Request, res: Response, next: NextFunction): void => {
    Product.findOne({ where: { code: req.params.code.toString() } })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) =>
        res
          .status(401)
          .json({ status: false, message: 'Fail retrieving data!', error: err })
      );
  },

  createProduct: (req: Request, res: Response, next: NextFunction): void => {
    const code: string = req.body.code;
    const name: string = req.body.name;
    const category: string = req.body.category;
    const brand: string = req.body.brand;
    const type: string = req.body.type;
    const description: string = req.body.description;
    if (code === '') {
      res.status(400).json({ status: false, message: 'The code not be null' });
    }
    if (name === '') {
      res.status(400).json({ status: false, message: 'The name not be null' });
    }
    if (category === '') {
      res
        .status(400)
        .json({ status: false, message: 'The category not be null' });
    } else {
      Product.create({
        code,
        name,
        category,
        brand,
        type,
        description,
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) =>
          res.status(401).json({
            status: false,
            message: 'Fail creating data!',
            error: err,
          })
        );
    }
  },

  updateProduct: (req: Request, res: Response, next: NextFunction): void => {
    // FIXME
    const name: string = req.body.name;
    const category: string = req.body.category;
    const brand: string = req.body.brand;
    const type: string = req.body.type;
    const description: string = req.body.description;
    Product.update(
      {
        name,
        category,
        brand,
        type,
        description,
      },
      { where: { code: req.params.code.toString() } }
    )
      .then((data) => {
        res.status(200).json({
          data,
          status: true,
          message: 'Update Succesfull',
        });
      })
      .catch((err) =>
        res
          .status(401)
          .json({ status: false, message: 'Fail updating data!', error: err })
      );
  },

  deleteProduct: (req: Request, res: Response, next: NextFunction): void => {
    Product.findOne({
      where: { code: req.params.code.toString() },
    }).then((data) => {
      console.log('🚀 ~ file: productApiController.ts ~ line 140 ~ data', data);
      if (data) {
        Product.destroy({ where: { code: req.params.code.toString() } })
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Delete Succesfull',
            });
          })
          .catch((err) =>
            res.status(401).json({
              status: false,
              message: 'Fail retrieving data!',
              error: err,
            })
          );
      } else {
        res.status(400).json({
          status: false,
          message: 'The code does not existed!',
        });
      }
    });
  },
};

export default productApiController;
