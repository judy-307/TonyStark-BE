import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product';

const productController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    // const page = parseInt(req.params.page) || 0;
    let page: any;
    if (req.query) {
      if (req.query.page !== undefined) {
        page = req.query.page;
      }
    }
    page = 0;
    const sizePage = 5;
    const count = await Product.count();
    let products = await Product.findAll({
      offset: page,
      limit: sizePage,
    });
    let message: string = '';
    if (!Array.isArray(products)) {
      products = [];
      message = 'Fail to retrieve records.';
    }
    res.render('pages/product/index', {
      message,
      products,
      current: page,
      pages: Math.ceil(count / sizePage),
    });
  },

  pagination: async (req: Request, res: Response, next: NextFunction) => {
    let page: any;
    if (req.query) {
      if (req.query.page !== undefined) {
        page = req.query.page;
      }
    }

    const sizePage = 5;
    const count = await Product.count();
    let products = await Product.findAll({
      offset: page,
      limit: sizePage,
    });
    let message: string = '';
    if (!Array.isArray(products)) {
      products = [];
      message = 'Fail to retrieve records.';
    }
    res.render('pages/product/index', {
      message,
      products,
      current: page,
      pages: Math.ceil(count / sizePage),
    });
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/product/add', {
      message: 'not implemented',
    });
  },

  store: async (req: Request, res: Response, next: NextFunction) => {
    const dataProduct = req.body;

    await Product.create(dataProduct);

    res.redirect('/product');
  },

  show: async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findAll({
      where: { code: req.params.code },
    });
    // const product = [
    //   {
    //     id: 15,
    //     code: 'P015',
    //     name: 'Keknis Basic Wide Long Shawl',
    //     category: 'Hijab',
    //     brand: 'No Brand',
    //     type: 'Plain Shawl',
    //     description: '1.8m X 0.7m (+/-). Heavy chiffon (120 gsm).',
    //     created_at: '2022-10-19T07:46:49.000Z',
    //     updated_at: '2022-10-19T07:46:49.000Z',
    //   },
    // ];
    // const message: string = '';

    res.render('pages/product/detail', {
      message: '',
      product,
    });
  },

  edit: async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findAll({ where: { code: req.params.code } });

    res.render('pages/product/edit', {
      message: 'not implemented',
      product,
    });
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    await Product.update(req.body, { where: { code: req.params.code } });
    // res.render('pages/product/error', {
    //   message: 'not implemented',
    // });
    res.redirect('/product');
  },

  destroy: async (req: Request, res: Response, next: NextFunction) => {
    await Product.destroy({ where: { code: req.params.code } });

    res.redirect('/product');
  },
};

export default productController;
