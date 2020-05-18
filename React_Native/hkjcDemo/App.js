import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	AsyncStorage,
	Image,
} from "react-native";
import init from "react_native_mqtt";

init({
	size: 10000,
	storageBackend: AsyncStorage,
	defaultExpires: 1000 * 3600 * 24,
	enableCache: true,
	reconnect: true,
	sync: {},
});

export default class App extends Component {
	constructor(props) {
		super(props);
		const client = new Paho.MQTT.Client(
			"mr22gx8ufrq5gb.messaging.solace.cloud",
			20073,
			"msgvpn-22gx8ufrtvhl"
		);
		client.onConnectionLost = this.onConnectionLost;
		client.onMessageArrived = this.onMessageArrived;
		client.connect({
			userName: "solace-cloud-client",
			password: "2gm0hhma6e04asa27coorhsvp0",
			onSuccess: this.onConnect,
			onFailure: this.onConnectError,
			useSSL: true,
		});

		// client.subscribe('mark_six_result',{onSuccess: this.successSub, onFailure: this.failSub})
		this.state = {
			client,
			results: [],
			paths: [],
		};
	}
	onConnect = () => {
		const { client } = this.state;
		client.subscribe("mark_six_result", {
			onSuccess: this.successSub,
			onFailure: this.failSub,
		});
		console.log("onConnect");
	};
	onConnectError = (responseObject) => {
		console.log("cannot Connect", responseObject);
	};
	onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:" + responseObject.errorMessage);
		}
	};

	onMessageArrived = (message) => {
		console.log("onMessageArrived:" + message.payloadString);
		var temp = JSON.parse(message.payloadString);

		// this.setState({results:temp.results})
		var x;
		var temp_paths = [];
		for (x in temp.results) {
			temp_paths.push(
				`https://pj003-sp002-nam-temp.s3-ap-southeast-1.amazonaws.com/marksix_ball/${temp.results[x]}.gif`
			);
		}
		// console.log(temp.results, temp_paths, "@@@@@");
		this.setState({ results: temp.results, paths: temp_paths });
	};
	// subTopic = topicName => {
	//   client.subscribe(topicName,{onSuccess: successSub, onFailure: failSub})
	// }
	successSub = (responseObject) => {
		console.log("Successfully subscribe to the topic" + responseObject);
	};
	failSub = (responseObject) => {
		console.log("Cannot subscribe to the topic" + responseObject);
	};
	render() {
		return (
			<View style={styles.container}>
				<Image
					style={{ width: 298, height: 70, flexShrink: 1, top: -100 }}
					source={require(`./Logo/hkjclogo_e.png`)}
				/>
				<Image
					style={{
						width: 158,
						height: 50,
						flexShrink: 1,
						top: -80,
						right: 90,
					}}
					source={require(`./Logo/Sonivy.png`)}
				/>
				<Image
					style={{
						width: 158,
						height: 44,
						flexShrink: 1,
						top: -130,
						right: -90,
					}}
					source={require(`./Logo/Solace_Logo.png`)}
				/>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[0] }}
				/>
				<Text>{this.state.results[0]}</Text>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[1] }}
				/>
				<Text>{this.state.results[1]}</Text>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[2] }}
				/>
				<Text>{this.state.results[2]}</Text>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[3] }}
				/>
				<Text>{this.state.results[3]}</Text>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[4] }}
				/>
				<Text>{this.state.results[4]}</Text>
				<Image
					style={{ width: 50, height: 50 }}
					source={{ uri: this.state.paths[5] }}
				/>
				<Text>{this.state.results[5]}</Text>
				<Image
					style={{ width: 50, height: 50, right: -80 }}
					source={{ uri: this.state.paths[6] }}
				/>
				<Text>The Special Number is: {this.state.results[6]}</Text>
				{/* <Button
          title="Subscribe"
          onPress={() => this.subTopic('mark_six_result')}
        /> */}
				{/* <Button
          title="Subscribe"
          onPress={() => client.subscribe('mark_six_result',{onSuccess: this.successSub, onFailure: this.failSub})}
        /> */}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10,
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5,
	},
});
