import { DateTime } from 'luxon';
import { UserTable, DateIso } from '~/db/types.db';
import uuid from '~/common/uuid';

type YesNo = 'oui' | 'non';

type Level =
  | 'découverte'
  | 'N1'
  | 'N2'
  | 'N3'
  | 'initiateur'
  | 'explo'
  | 'enfant'
  | 'NPN';
type TechLevel =
  | 'aucun'
  | 'P1'
  | 'P2'
  | 'P3'
  | 'P4'
  | 'P5'
  | 'E1'
  | 'E2'
  | 'P5+E2'
  | 'E3'
  | 'E4'
  | 'voir DT';
type NitroxLevel =
  | 'aucun'
  | 'nitrox'
  | 'nitrox confirmé'
  | 'trimix'
  | 'trimix confirmé';

type Membre = {
  ID: string;
  civilite: 'M' | 'Mme' | 'Mlle';
  nom: string;
  prenom: string;
  date_naiss: string; //"1994-06-24"
  lieu_naiss: string; //"villeneuve d'ascq";
  dept_naiss: string | null; // "81"
  adresse: string; //'150 rue de maul\u00e9on';
  cpostal: string; //'81000';
  ville: string; //'Albi';
  tel: string | null; //'0123456789';
  tel_mobile: string | null;
  tel_bureau: string | null;
  email: string; //'...@gmail.com';
  num_etudiant: string | null; //'21201582';
  UPS: YesNo;
  contact_nom: string; //'BALLOY';
  contact_prenom: string; //'Anne';
  contact_tel: string | null; //'0780443306';
  contact_mobile: string | null;
  contact_bureau: string | null;
  effacer_infos_medicales: YesNo;
  allergique_aspirine: YesNo;
  medicaments: YesNo;
  medic_compat: YesNo;
  date_form: string; //'2017-10-05';
  type_inscription: Level; //'N1';
  num_licence: string | null;
  date_certif: string | null; //'2017-10-05';
  niv_tech: TechLevel;
  niv_nitrox: NitroxLevel;
  fichier_certif: string | null; //'Base/certif/aballo_64644.pdf';
  fichier_assurance: string | null; //'Base/assurance/aballo_64644.pdf';
  assurance_individuelle: string; //'aucun';
  deja_pris_licence: YesNo | null;
  RI_CGV: YesNo;
  fichier_autorisation_parentale: string | null;
  recapitulatif_paiement: string | null; //"Cotisation \u00e0 l'association : 54.8\u20ac <br>Licence adulte FFESSM : 39.2\u20ac <br>";
  montant_total: string | null; //'94.00';
};

const membres: Array<Membre> = require('../../membre_adlm.json');
console.log(membres.length);

function parseDate(date: string): DateIso {
  const parsed = DateTime.fromFormat(date, 'YYYY-MM-DD');
  if (!parsed.isValid) {
    throw new Error(parsed.invalidReason);
  }
  return parsed.toISO();
}

function parseYesNo(value: YesNo): boolean {
  return value === 'oui';
}

function convert(membre: Membre): { user: UserTable } {
  return {
    user: {
      id: uuid(),
      firstName: membre.prenom,
      lastName: membre.nom,
      email: membre.email,
      password: uuid(),
      phone: membre.tel || '',
      phoneSecondary: membre.tel_mobile,
      avatarFileId: null,
      licenseNumber: membre.num_licence,
      licenseFileId: null,
      birthdate: parseDate(membre.date_naiss),
      birthplace: membre.lieu_naiss,
      addressStreet: membre.adresse,
      addressZipcode: membre.cpostal,
      addressCity: membre.ville,
      studentNumber: membre.num_etudiant,
      isUPS: parseYesNo(membre.UPS),
      deleteMedicalRecord: parseYesNo(membre.effacer_infos_medicales),
      isAspirinAllergic: parseYesNo(membre.allergique_aspirine),
      medicalCertificateId: null,
      medicalCertificateExpiresAt: null,
      insuranceId: null,
      insuranceFileId: null,
      parentalPermissionFileId: null,
      isAdmin: false,
      passwordToken: null,
      sessionToken: uuid(),
      newEmail: null,
      newEmailToken: null,
      lastActivity: null,
    },
  };
}
