# https://github.com/webcamoid/akvirtualcamera/wiki

# SERVER
# https://github.com/aler9/rtsp-simple-server



# LIST DEVICES
ffmpeg -f avfoundation -list_devices true -i ""
AkVCamManager devices


# CREATE DEVICE
AkVCamManager load cameras.ini

# FORMATS
AkVCamManager supported-formats --input
AkVCamManager supported-formats --output
AkVCamManager formats Virtual16x9

##################################################

# Stream to network
ffmpeg -i /dev/video0 -vcodec rawvideo -f matroska - | nc -l 9999


###########################################
# Listen from network -> push to camera
nc 192.168.0.31 9999 | ffmpeg -i /dev/stdin -codec copy -f matroska -  | AkVCamManager stream AkVCamVideoDevice0 YUY2 640 480

# Play from camera camera
ffplay -f avfoundation -i 0 -framerate 30



###########################################
nc 192.168.0.31 9999 | vlc -


ffplay -f avfoundation -i 0 -framerate 30
