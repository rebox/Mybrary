const rootStyles = window.getComputedStyle(document.documentElement);

if (
  rootStyles.getPropertyPriority("--book-cover-width-large") != null &&
  rootStyles.getPropertyPriority("--book-cover-width-large") != ""
) {
  ready();
} else {
  document.getElementById("main_css").addEventListener("load", ready);
}

function ready() {
  const coverWidth = parseFloat(
    rootStyles.getPropertyPriority("--book-cover-width-large")
  );
  const coverAspectRatio = parseFloat(
    rootStyles.getPropertyPriority("--book-cover-aspect-ratio")
  );
  const coverHeight = coverWidth / coverAspectRatio;
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
  });

  FilePond.parse(document.body);
}
