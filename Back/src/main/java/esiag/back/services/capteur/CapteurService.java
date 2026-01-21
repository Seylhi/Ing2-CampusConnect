package esiag.back.services.capteur;

import esiag.back.models.capteur.Capteur;
import esiag.back.repositories.capteur.CapteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CapteurService {

    @Autowired
    private CapteurRepository capteurRepository;

    public Capteur findById(Long id){
        Optional<Capteur> capteur = capteurRepository.findById(id);
        return capteur.orElse(null);
    }

    public List<Capteur> findAll(){
        return capteurRepository.findAll();
    }

    public List<Capteur> findBySalle(Long idSalle){
    return capteurRepository.findByIdSalleOrderByIdSalleAsc(idSalle);
}


    public Capteur save(Capteur capteur){
        return capteurRepository.save(capteur);
    }

    public boolean delete(Long id){
        if(capteurRepository.existsById(id)){
            capteurRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean update(Capteur capteur){
        if(capteurRepository.existsById(capteur.getId())){
            capteurRepository.save(capteur);
            return true;
        }
        return false;
    }
}
