type SvgIconProps = {
  id: string;
  width: string;
  height: string;
};

export const SvgImage: React.FC<SvgIconProps> = ({
  id,
  width = "100",
  height = "100",
}) => {
  return (
    <svg width={width} height={height}>
      <use href={`#${id}`} />
    </svg>
  );
};
