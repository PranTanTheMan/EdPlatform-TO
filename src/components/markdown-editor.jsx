import MarkdownIt from "markdown-it";
import dynamic from "next/dynamic";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default ({ handleChange, value }) => {
  return (
    <MdEditor
      style={{ height: "500px" }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleChange}
      value={value}
    />
  );
};
