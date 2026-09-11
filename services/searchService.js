import {catalogService} from './catalogService';
export const searchService={search:query=>catalogService.getProducts({search:query})};
