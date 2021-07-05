

export class Threading {
	static sleep(millis: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, millis))
	}
}


