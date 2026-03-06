package esiag.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EsiagBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(EsiagBackApplication.class, args);
	}
}
