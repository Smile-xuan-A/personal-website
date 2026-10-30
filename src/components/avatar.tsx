import type { CSSProperties } from "react";

/** 头像：有图则渲染图片，无图则用姓名首字母占位。面积由调用方通过 size 决定。 */
export function Avatar({
  src,
  name,
  size = 56,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  const box: CSSProperties = { width: size, height: size };

  if (!src) {
    return (
      <div
        className="avatar avatar-fallback"
        style={{ ...box, fontSize: Math.round(size * 0.38) }}
        aria-hidden="true"
      >
        {name.trim().slice(0, 1).toUpperCase() || "?"}
      </div>
    );
  }

  return <img className="avatar" src={src} alt={`${name} 的头像`} width={size} height={size} style={box} />;
}
