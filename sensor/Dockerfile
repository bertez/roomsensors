FROM resin/rpi-raspbian

RUN apt-get -y update && \
apt-get -y upgrade && \
apt-get -y install python3-pip python-pip sense-hat && \
ln -fs /usr/share/zoneinfo/Europe/Madrid /etc/localtime

ADD . /sensor
WORKDIR /sensor
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
