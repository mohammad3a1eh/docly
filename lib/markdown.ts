export function markdownToHtml(md: string): string {
  let html = md
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/^- \[x\] (.*)$/gim, '<li class="task checked">$1</li>')
  html = html.replace(/^- \[ \] (.*)$/gim, '<li class="task">$1</li>')
  html = html.replace(/^- (.*)$/gim, '<li>$1</li>')
  html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>')
  html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>')
  html = html.replace(/^---$/gim, '<hr />')
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><h/g, '<h').replace(/<\/h([1-6])><\/p>/g, '</h$1>')
  html = html.replace(/<p><blockquote>/g, '<blockquote>').replace(/<\/blockquote><\/p>/g, '</blockquote>')
  html = html.replace(/<p><pre>/g, '<pre>').replace(/<\/pre><\/p>/g, '</pre>')
  html = html.replace(/<p><hr \/><\/p>/g, '<hr />')
  return html
}
