# CheckDistill · GitHub Pages

项目仓库：https://github.com/FaltingsA/CheckDistill.github.io

计划发布地址：https://faltingsa.github.io/CheckDistill.github.io/

页面地址已写入 `site-config.js` 和网页元信息；GitHub Pages 启用并完成构建后生效。

基于最新版 CheckDistill 技术报告制作的纯静态学术项目页。已整理为仓库根目录结构，无需 npm、构建工具、API Key 或后端服务。

## 1. 发布到 GitHub Pages

1. 在 GitHub 创建用于网页的仓库，例如 `checkdistill`。
2. 解压项目包，把其中的全部文件和 `assets/` 文件夹上传到仓库根目录。确保 `index.html` 直接位于根目录，而非再嵌套一层文件夹。
3. 提交到 `main` 分支。
4. 打开仓库的 **Settings → Pages**。
5. 在 **Build and deployment** 中，选择 **Deploy from a branch**，分支选择 **main**，目录选择 **/(root)**，然后保存。
6. 发布完成后，Pages 设置页会显示网址。普通项目仓库的地址形式为 `https://你的用户名.github.io/仓库名/`，请以 GitHub 实际返回的地址为准。

此项目使用相对资源路径，兼容上述带仓库子路径的地址，也兼容用户名主页仓库。`.nojekyll` 已包含在包中。

官方操作说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 2. 填写链接

编辑 `site-config.js`：

```js
window.CHECKDISTILL_CONFIG = Object.freeze({
  projectUrl: '',
  codeUrl: '',
  paperUrl: 'assets/CheckDistill-Technical-Report.pdf'
});
```

- `projectUrl`：标准 `github.io` 页面会自动检测网址，并添加到 BibTeX 引用。使用自定义域名时，请在此填入完整网址，建议以 `/` 结尾。
- `codeUrl`：填写真正的研究代码仓库地址后，首页及页尾的 Code 链接会自动启用。留空时显示 Coming soon。网页仓库与研究代码仓库可以是不同仓库。
- `paperUrl`：默认打开随包附带的 29 页论文 PDF；之后可改为论文网页或新版 PDF 地址。

如需社交平台链接预览，确定正式网址后，在 `index.html` 的 `<head>` 内添加指向正式页面的 `og:url` 和指向 `assets/qualitative.webp` 的完整 `og:image` URL。

## 3. 本地查看

可以用浏览器打开 `index.html`，或在此目录运行：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

然后访问 http://127.0.0.1:4173 。

## 4. 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面内容、作者信息、完整摘要与 BibTeX |
| `style.css` | 柔和橘色主题、桌面与手机布局 |
| `app.js` | 基准切换、案例对比、图表放大与引用复制 |
| `site-config.js` | 项目页、研究代码和论文链接 |
| `assets/` | 论文 PDF、原 Logo、图表与案例图像 |
| `.nojekyll` | 让 GitHub Pages 直接发布静态文件 |

## 5. 内容与素材来源

内容以最新版 CheckDistill LaTeX 项目实际启用的正文为准，未使用注释中的旧实验数值。

- 作者、单位及身份标记沿用技术报告；作者姓名无 OpenReview 链接。
- Abstract 保留全文；方法与说明文字根据正文整理。
- 14 个模型 × 3 个基准的 42 个 aggregate 数值已逐项核对。
- 下游基线为 4.29、4.10、8.18，CheckDistill 指导训练后的结果为 4.46、4.26、8.28。
- 约 1/70 的比较表示输出 token 数，不是实测时延加速比。
- 五组交互案例来自论文 Figure 4 的原始图像面板；仅导出面板用于网页对比，没有重新生成图像。
- 方法图、核查案例、缩放实验图及附录 showcase 均来自论文素材。
- GitHub 图标沿用原项目的 Font Awesome Free 素材，许可见 `assets/icons-LICENSE.txt`。

已检查桌面和 390px 手机布局、基准与案例切换、对比滑块、图表放大和引用复制。页面无需外部字体或第三方 JavaScript 服务。
