gcloud auth login          # opens browser
cd /Applications/YogicWellness/ui

gcloud storage cp assets/meditation-focus-audios/*.mp3 \
  gs://karmana-media-prod/assets/meditation-focus-audios/

gcloud storage cp assets/Mindfullness/*.mp3 \
  gs://karmana-media-prod/assets/Mindfullness/