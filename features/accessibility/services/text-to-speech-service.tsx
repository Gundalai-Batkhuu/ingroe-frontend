import OpenAI from 'openai';

export class TextToSpeechService {
	private openai: OpenAI;
	private speechUrl: string;
	private headers: { [key: string]: string };

	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		});
		this.speechUrl = 'https://api.openai.com/v1/audio/speech';
		this.headers = {
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/json'
		};
	}

	async generateSpeech(text: string): Promise<Buffer> {
		console.log('generateSpeech is triggered');
		console.log('text: ', text);

		const body = JSON.stringify({
			model: 'tts-1',
			input: text,
			voice: 'alloy',
			response_format: 'mp3',
			speed: 0.9
		});

		try {
			const response = await fetch(this.speechUrl, {
				method: 'POST',
				headers: this.headers,
				body: body
			});

			if (response.ok) {
				const arrayBuffer = await response.arrayBuffer();
				return Buffer.from(arrayBuffer);
			} else {
				console.log('response: ', response);
				throw new Error(
					`Unexpected response status: ${response.status}`
				);
			}
		} catch (error) {
			console.error('OpenAI API failed, error: ', error);
			throw error;
		}
	}
}
