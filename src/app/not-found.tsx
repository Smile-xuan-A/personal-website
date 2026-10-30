import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container not-found">
      <span className="not-found-code">404 / 页面未找到</span>
      <h1 className="not-found-title">这个页面不存在</h1>
      <p>链接可能已经失效，或者内容还没发布。</p>
      <div style={{ marginTop: 28 }}>
        <Link href="/" className="btn btn-primary">
          回到首页
        </Link>
      </div>
    </section>
  );
}