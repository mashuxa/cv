import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CvDocument } from '../src/Cv.jsx';

export function render(props) {
  return '<!doctype html>\n' + renderToStaticMarkup(<CvDocument {...props} />) + '\n';
}
