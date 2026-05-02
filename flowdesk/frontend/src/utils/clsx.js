// Lightweight classname joiner (replaces clsx package)
export default function clsx(...args) {
  return args.filter(Boolean).join(' ');
}