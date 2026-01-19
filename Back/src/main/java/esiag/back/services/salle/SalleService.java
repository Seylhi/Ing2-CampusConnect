package esiag.back.services.salle;

import esiag.back.models.salle.Salle;
import esiag.back.repositories.salle.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalleService {

    @Autowired
    private SalleRepository salleRepository;

    public List<Salle> findAllSalles() {
        return salleRepository.findAllByOrderByIdSalleAsc(); // c'est entre autre, ce qu'on veut afficher dans notre tableau 
    }

    public Salle findByIdSalle(Long idSalle) {
        return salleRepository.findById(idSalle).orElse(null);
    }
}
