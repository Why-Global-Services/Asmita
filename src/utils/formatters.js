import {CURRENCY} from './constants';
export const money=value=>`${CURRENCY}${Number(value||0).toLocaleString('en-IN')}`;
export const date=value=>new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
export const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
