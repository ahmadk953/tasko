import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from '@arcjet/next';

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['ip.src', 'http.host'],
  rules: [],
});
