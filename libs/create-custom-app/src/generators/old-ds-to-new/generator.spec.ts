import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { gingaToJadeGenerator } from './generator';
import { GingaToJadeGeneratorSchema } from './schema';

describe('old-ds-to-new generator', () => {
  let tree: Tree;
  const options: GingaToJadeGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await gingaToJadeGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
