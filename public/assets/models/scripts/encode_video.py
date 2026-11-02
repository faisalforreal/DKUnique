import subprocess
import os
import shutil

ffmpeg = r"C:\msys64\mingw64\bin\ffmpeg.exe"
frames_pattern = r"C:\tmp\dk_hologram_frames\frame_%04d.png"

base_dir = r"c:\Users\mdfai\Documents\SideProjects\DkUnique"
demo_dir = os.path.join(base_dir, "public", "assets", "demo")
models_dir = os.path.join(base_dir, "public", "assets", "models")
scripts_dir = os.path.join(models_dir, "scripts")

os.makedirs(demo_dir, exist_ok=True)
os.makedirs(models_dir, exist_ok=True)
os.makedirs(scripts_dir, exist_ok=True)

out_mp4 = os.path.join(demo_dir, "holo-loop.mp4")
out_webm = os.path.join(demo_dir, "holo-loop.webm")
out_poster = os.path.join(demo_dir, "holo-poster.webp")

print("Encoding MP4 (H.264 60fps)...")
cmd_mp4 = [
    ffmpeg, "-y",
    "-framerate", "60",
    "-i", frames_pattern,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "17",
    "-preset", "slow",
    "-movflags", "+faststart",
    out_mp4
]
subprocess.run(cmd_mp4, check=True)

print("Encoding WebM (VP9 60fps)...")
cmd_webm = [
    ffmpeg, "-y",
    "-framerate", "60",
    "-i", frames_pattern,
    "-c:v", "libvpx-vp9",
    "-b:v", "3M",
    "-pix_fmt", "yuv420p",
    out_webm
]
subprocess.run(cmd_webm, check=True)

print("Extracting poster webp...")
cmd_poster = [
    ffmpeg, "-y",
    "-ss", "00:00:01",
    "-i", out_mp4,
    "-vframes", "1",
    "-q:v", "85",
    out_poster
]
subprocess.run(cmd_poster, check=True)

# Copy mp4 to models and scripts folder as well
shutil.copy2(out_mp4, os.path.join(scripts_dir, "hologram.mp4"))
shutil.copy2(out_mp4, os.path.join(models_dir, "hologram.mp4"))

print("All video assets processed successfully!")
