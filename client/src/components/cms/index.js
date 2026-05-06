export { default as EditableText }  from './EditableText';
export { default as EditableImage } from './EditableImage';

export const STORAGE_PREFIX = 'upgraied_cms';
export const cmsKey = (key) => `${STORAGE_PREFIX}_${key}`;
