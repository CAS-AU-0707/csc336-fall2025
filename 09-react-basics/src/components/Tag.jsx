function Tag({ label, variant = "neutral" }) {
  const className = `tag tag-${variant}`;
  return <span className={className}>{label}</span>;
}

export default Tag;
