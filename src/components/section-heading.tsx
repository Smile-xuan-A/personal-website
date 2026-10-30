import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  aside,
  action,
}: {
  index: string;
  title: string;
  aside?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div className="section-head-main">
        <span className="section-index">{index}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {aside ? <p className="section-aside">{aside}</p> : null}
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}