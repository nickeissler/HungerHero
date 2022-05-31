/** import {
  Map, GoogleApiWrapper, InfoWindow, Marker,
} from 'google-maps-react';
import React from 'react';
import { Container, Row } from 'react-bootstrap';

export class Maps extends React.Component {
  state = {
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
  };

  onMarkerClick = (props, marker, e) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,
  });

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };
  return (
      <Container>
        <Row className="justify-content-center">
          <Map
            google={this.props.google}
            zoom={15}
            style={mapStyles}
            initialCenter={{ lat: 39.951160, lng: -75.200990 }}
          >
            <Marker
              onClick={this.onMarkerClick}
              name="Kenyatta International Convention Centre"
              position={{ lat: 40.1160, lng: -75.210990 }}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </Map>
        </Row>
      </Container>
  );
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCf7VPs-ZrZd1sjV8If7xQBlkiYNqamnE0',
})(Maps);
*/
