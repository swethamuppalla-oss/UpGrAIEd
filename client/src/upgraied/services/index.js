/**
 * Upgraied V2 service layer.
 * Re-exports the shared service barrel so V2 pages import from one place
 * and never reach into the V1 internals directly.
 */
export {
  getContent,
  updateContent,
} from '../../services/contentService'

export { uploadMedia } from '../../services/mediaService'

export {
  get,
  post,
  put,
  del,
} from '../../services/api'
