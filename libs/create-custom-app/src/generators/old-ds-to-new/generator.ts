// import {
//   addProjectConfiguration,
//   formatFiles,
//   generateFiles,
//   Tree,
// } from '@nx/devkit';
// import * as path from 'path';
// import { GingaToJadeGeneratorSchema } from './schema';

// export async function gingaToJadeGenerator(
//   tree: Tree,
//   options: GingaToJadeGeneratorSchema
// ) {
//   const projectRoot = `libs/${options.name}`;
//   addProjectConfiguration(tree, options.name, {
//     root: projectRoot,
//     projectType: 'library',
//     sourceRoot: `${projectRoot}/src`,
//     targets: {},
//   });
//   generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
//   await formatFiles(tree);
// }

// export default gingaToJadeGenerator;



import { readProjectConfiguration, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { test } from 'node:test';
import { ImportDeclaration, JsxOpeningElement, TypeReferenceNode } from 'typescript';

/**
 * Run the callback on all files inside the specified path
 */
function visitAllFiles(
  tree: Tree,
  path: string,
  callback: (filePath: string) => void
) {
  tree.children(path).forEach((fileName) => {
    const filePath = `${path}/${fileName}`;
    if (!tree.isFile(filePath)) {
      visitAllFiles(tree, filePath, callback);
    } else {
      console.log(filePath);

      callback(filePath);
    }
  });
}

export default function (tree: Tree, schema: any) {
  const sourceRoot = readProjectConfiguration(tree, schema.name).sourceRoot;
  visitAllFiles(tree, sourceRoot, (filePath) => {
    const fileEntry = tree.read(filePath);
    const contents = fileEntry.toString();

    if (tsquery.query(contents, 'ImportDeclaration:has([value="@org/design-system"])')[0]) {
      // const test = tsquery.query(contents, 'ImportDeclaration:has([value="@org/design-system"])') as ImportDeclaration[]
      const test = tsquery.query(contents, 'VariableStatement', { visitAllChildren: true })
      // const test = tsquery.query(contents, 'ImportDeclaration:has([value="@org/design-system"])')[0].getChildAt(1) as ImportDeclaration

      console.log(test);
    }

    // Check each `TypeReference` node to see if we need to replace it
    // const newContents = tsquery.replace(contents, 'TypeReference', (node) => {
    //   const trNode = node as TypeReferenceNode;
    //   if (trNode.typeName.getText() === 'Array') {
    //     const typeArgument = trNode.typeArguments[0];
    //     return `${typeArgument.getText()}[]`;
    //   }
    //   // return undefined does not replace anything
    // });

    // // only write the file if something has changed
    // if (newContents !== contents) {
    //   tree.write(filePath, newContents);
    // }
  });
}