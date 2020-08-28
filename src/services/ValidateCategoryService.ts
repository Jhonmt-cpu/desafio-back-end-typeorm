import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}
class ValidateCategoryService {
  public async execute({ category }: Request): Promise<string> {
    const categoryRepository = getRepository(Category);

    const categoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      return newCategory.id;
    }
    return categoryExists.id;
  }
}

export default ValidateCategoryService;
