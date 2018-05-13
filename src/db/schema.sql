--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3 (Ubuntu 10.3-1)
-- Dumped by pg_dump version 10.3 (Ubuntu 10.3-1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";


--
-- Name: EXTENSION "plpgsql"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "plpgsql" IS 'PL/pgSQL procedural language';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";


--
-- Name: EXTENSION "citext"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "citext" IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: AquiredLevel; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."AquiredLevel" (
    "userId" "uuid" NOT NULL,
    "levelId" "uuid" NOT NULL,
    "obtainedAt" timestamp with time zone NOT NULL,
    "tempFileId" "uuid",
    "fileId" "uuid"
);


ALTER TABLE "public"."AquiredLevel" OWNER TO "adlm";

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Contact" (
    "id" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "firstName" "text" NOT NULL,
    "lastName" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "phoneSecondary" "text"
);


ALTER TABLE "public"."Contact" OWNER TO "adlm";

--
-- Name: Diver; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Diver" (
    "userId" "uuid" NOT NULL,
    "teamId" "uuid" NOT NULL,
    "status" "text" NOT NULL
);


ALTER TABLE "public"."Diver" OWNER TO "adlm";

--
-- Name: DiverStatus; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DiverStatus" (
    "value" "text" NOT NULL
);


ALTER TABLE "public"."DiverStatus" OWNER TO "adlm";

--
-- Name: DivingSession; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DivingSession" (
    "id" "uuid" NOT NULL,
    "spotId" "uuid" NOT NULL,
    "directorId" "uuid",
    "director" "text",
    "at" timestamp with time zone NOT NULL,
    "price" "money" NOT NULL,
    "kind" "text" NOT NULL
);


ALTER TABLE "public"."DivingSession" OWNER TO "adlm";

--
-- Name: DivingSessionKind; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DivingSessionKind" (
    "value" "text" NOT NULL
);


ALTER TABLE "public"."DivingSessionKind" OWNER TO "adlm";

--
-- Name: DivingSpot; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DivingSpot" (
    "id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "locationId" "uuid" NOT NULL
);


ALTER TABLE "public"."DivingSpot" OWNER TO "adlm";

--
-- Name: DivingTeam; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DivingTeam" (
    "id" "uuid" NOT NULL,
    "sessionId" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "maxTime" integer NOT NULL,
    "maxDepth" integer NOT NULL,
    "startedAt" timestamp with time zone,
    "endedAt" timestamp with time zone,
    "measuredTime" integer,
    "measuredMaxDepth" integer,
    "notes" "text",
    "stops" "point"[] NOT NULL
);


ALTER TABLE "public"."DivingTeam" OWNER TO "adlm";

--
-- Name: COLUMN "DivingTeam"."stops"; Type: COMMENT; Schema: public; Owner: adlm
--

COMMENT ON COLUMN "public"."DivingTeam"."stops" IS 'This is kind of a hack, we need a tuple of 2 integers for depth and time which is what a point is, so let''s use that.';


--
-- Name: DivingTeamKind; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."DivingTeamKind" (
    "value" "text" NOT NULL
);


ALTER TABLE "public"."DivingTeamKind" OWNER TO "adlm";

--
-- Name: File; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."File" (
    "id" "uuid" NOT NULL
);


ALTER TABLE "public"."File" OWNER TO "adlm";

--
-- Name: Insurance; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Insurance" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."Insurance" OWNER TO "adlm";

--
-- Name: Level; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Level" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "shortname" "text" NOT NULL,
    "supervisedDepth" integer NOT NULL,
    "independentDepth" integer NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."Level" OWNER TO "adlm";

--
-- Name: Location; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Location" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "address" "text" NOT NULL,
    "longitude" numeric(15,12) NOT NULL,
    "latitude" numeric(15,12) NOT NULL
);


ALTER TABLE "public"."Location" OWNER TO "adlm";

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Settings" (
    "id" "uuid" NOT NULL,
    "googleMapsApiKey" "text" NOT NULL,
    "levelN1Id" "uuid" NOT NULL,
    "levelN2Id" "uuid" NOT NULL,
    "levelN3Id" "uuid" NOT NULL,
    "levelN4Id" "uuid" NOT NULL,
    "levelN5Id" "uuid" NOT NULL,
    "levelRifapId" "uuid" NOT NULL,
    "levelNitroxSimpleId" "uuid" NOT NULL,
    "levelNitroxComplexId" "uuid" NOT NULL,
    "levelInitId" "uuid" NOT NULL,
    "levelMF1Id" "uuid" NOT NULL,
    "levelMF2Id" "uuid" NOT NULL,
    "levelBio1Id" "uuid" NOT NULL,
    "levelBio2Id" "uuid" NOT NULL
);


ALTER TABLE "public"."Settings" OWNER TO "adlm";

--
-- Name: User; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."User" (
    "id" "uuid" NOT NULL,
    "firstName" "text" NOT NULL,
    "lastName" "text" NOT NULL,
    "email" "public"."citext" NOT NULL,
    "password" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "phoneSecondary" "text",
    "avatarFileId" "uuid",
    "licenseNumber" "text",
    "licenseFileId" "uuid",
    "birthdate" timestamp with time zone NOT NULL,
    "birthplace" "text" NOT NULL,
    "addressStreet" "text" NOT NULL,
    "addressZipcode" "text" NOT NULL,
    "addressCity" "text" NOT NULL,
    "studentNumber" "text",
    "isUPS" boolean DEFAULT false NOT NULL,
    "deleteMedicalRecord" boolean DEFAULT true NOT NULL,
    "isAspirinAllergic" boolean DEFAULT false NOT NULL,
    "medicalCertificateId" "uuid",
    "medicalCertificateExpiresAt" timestamp with time zone,
    "insuranceId" "uuid",
    "insuranceFileId" "uuid",
    "parentalPermissionFileId" "uuid",
    "isAdmin" boolean DEFAULT false NOT NULL,
    "passwordToken" "text",
    "sessionToken" "text" NOT NULL,
    "newEmail" "public"."citext",
    "newEmailToken" "text"
);


ALTER TABLE "public"."User" OWNER TO "adlm";

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."Vehicle" (
    "id" "uuid" NOT NULL,
    "ownerId" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "capacity" integer NOT NULL,
    "sleeping" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."Vehicle" OWNER TO "adlm";

--
-- Name: VehicleKind; Type: TABLE; Schema: public; Owner: adlm
--

CREATE TABLE "public"."VehicleKind" (
    "value" "text" NOT NULL
);


ALTER TABLE "public"."VehicleKind" OWNER TO "adlm";

--
-- Name: AquiredLevel AquiredLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."AquiredLevel"
    ADD CONSTRAINT "AquiredLevel_pkey" PRIMARY KEY ("userId", "levelId");


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("id");


--
-- Name: DiverStatus DiverStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DiverStatus"
    ADD CONSTRAINT "DiverStatus_pkey" PRIMARY KEY ("value");


--
-- Name: Diver Diver_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Diver"
    ADD CONSTRAINT "Diver_pkey" PRIMARY KEY ("userId", "teamId");


--
-- Name: DivingSessionKind DivingSessionKind_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSessionKind"
    ADD CONSTRAINT "DivingSessionKind_pkey" PRIMARY KEY ("value");


--
-- Name: DivingSession DivingSession_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSession"
    ADD CONSTRAINT "DivingSession_pkey" PRIMARY KEY ("id");


--
-- Name: DivingSpot DivingSpot_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSpot"
    ADD CONSTRAINT "DivingSpot_pkey" PRIMARY KEY ("id");


--
-- Name: DivingTeamKind DivingTeamKind_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingTeamKind"
    ADD CONSTRAINT "DivingTeamKind_pkey" PRIMARY KEY ("value");


--
-- Name: DivingTeam DivingTeam_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingTeam"
    ADD CONSTRAINT "DivingTeam_pkey" PRIMARY KEY ("id");


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");


--
-- Name: Insurance Insurance_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Insurance"
    ADD CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id");


--
-- Name: Level Level_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Level"
    ADD CONSTRAINT "Level_pkey" PRIMARY KEY ("id");


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY ("id");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");


--
-- Name: VehicleKind VehicleKind_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."VehicleKind"
    ADD CONSTRAINT "VehicleKind_pkey" PRIMARY KEY ("value");


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id");


--
-- Name: User user_email_unique; Type: CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_email_unique" UNIQUE ("email");


--
-- Name: AquiredLevel aquiredlevel_fileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."AquiredLevel"
    ADD CONSTRAINT "aquiredlevel_fileid_foreign" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id");


--
-- Name: AquiredLevel aquiredlevel_levelid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."AquiredLevel"
    ADD CONSTRAINT "aquiredlevel_levelid_foreign" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id");


--
-- Name: AquiredLevel aquiredlevel_tempfileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."AquiredLevel"
    ADD CONSTRAINT "aquiredlevel_tempfileid_foreign" FOREIGN KEY ("tempFileId") REFERENCES "public"."File"("id");


--
-- Name: AquiredLevel aquiredlevel_userid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."AquiredLevel"
    ADD CONSTRAINT "aquiredlevel_userid_foreign" FOREIGN KEY ("userId") REFERENCES "public"."User"("id");


--
-- Name: Contact contact_userid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Contact"
    ADD CONSTRAINT "contact_userid_foreign" FOREIGN KEY ("userId") REFERENCES "public"."User"("id");


--
-- Name: Diver diver_status_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Diver"
    ADD CONSTRAINT "diver_status_foreign" FOREIGN KEY ("status") REFERENCES "public"."DiverStatus"("value");


--
-- Name: Diver diver_teamid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Diver"
    ADD CONSTRAINT "diver_teamid_foreign" FOREIGN KEY ("teamId") REFERENCES "public"."DivingTeam"("id");


--
-- Name: Diver diver_userid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Diver"
    ADD CONSTRAINT "diver_userid_foreign" FOREIGN KEY ("userId") REFERENCES "public"."User"("id");


--
-- Name: DivingSession divingsession_directorid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSession"
    ADD CONSTRAINT "divingsession_directorid_foreign" FOREIGN KEY ("directorId") REFERENCES "public"."User"("id");


--
-- Name: DivingSession divingsession_kind_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSession"
    ADD CONSTRAINT "divingsession_kind_foreign" FOREIGN KEY ("kind") REFERENCES "public"."DivingSessionKind"("value");


--
-- Name: DivingSession divingsession_spotid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSession"
    ADD CONSTRAINT "divingsession_spotid_foreign" FOREIGN KEY ("spotId") REFERENCES "public"."DivingSpot"("id");


--
-- Name: DivingSpot divingspot_locationid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingSpot"
    ADD CONSTRAINT "divingspot_locationid_foreign" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id");


--
-- Name: DivingTeam divingteam_kind_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingTeam"
    ADD CONSTRAINT "divingteam_kind_foreign" FOREIGN KEY ("kind") REFERENCES "public"."DivingTeamKind"("value");


--
-- Name: DivingTeam divingteam_sessionid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."DivingTeam"
    ADD CONSTRAINT "divingteam_sessionid_foreign" FOREIGN KEY ("sessionId") REFERENCES "public"."DivingSession"("id");


--
-- Name: Settings settings_levelbio1id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelbio1id_foreign" FOREIGN KEY ("levelBio1Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelbio2id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelbio2id_foreign" FOREIGN KEY ("levelBio2Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelinitid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelinitid_foreign" FOREIGN KEY ("levelInitId") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelmf1id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelmf1id_foreign" FOREIGN KEY ("levelMF1Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelmf2id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelmf2id_foreign" FOREIGN KEY ("levelMF2Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_leveln1id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_leveln1id_foreign" FOREIGN KEY ("levelN1Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_leveln2id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_leveln2id_foreign" FOREIGN KEY ("levelN2Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_leveln3id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_leveln3id_foreign" FOREIGN KEY ("levelN3Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_leveln4id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_leveln4id_foreign" FOREIGN KEY ("levelN4Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_leveln5id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_leveln5id_foreign" FOREIGN KEY ("levelN5Id") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelnitroxcomplexid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelnitroxcomplexid_foreign" FOREIGN KEY ("levelNitroxComplexId") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelnitroxsimpleid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelnitroxsimpleid_foreign" FOREIGN KEY ("levelNitroxSimpleId") REFERENCES "public"."Level"("id");


--
-- Name: Settings settings_levelrifapid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Settings"
    ADD CONSTRAINT "settings_levelrifapid_foreign" FOREIGN KEY ("levelRifapId") REFERENCES "public"."Level"("id");


--
-- Name: User user_avatarfileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_avatarfileid_foreign" FOREIGN KEY ("avatarFileId") REFERENCES "public"."File"("id");


--
-- Name: User user_insurancefileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_insurancefileid_foreign" FOREIGN KEY ("insuranceFileId") REFERENCES "public"."File"("id");


--
-- Name: User user_insuranceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_insuranceid_foreign" FOREIGN KEY ("insuranceId") REFERENCES "public"."Insurance"("id");


--
-- Name: User user_licensefileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_licensefileid_foreign" FOREIGN KEY ("licenseFileId") REFERENCES "public"."File"("id");


--
-- Name: User user_medicalcertificateid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_medicalcertificateid_foreign" FOREIGN KEY ("medicalCertificateId") REFERENCES "public"."File"("id");


--
-- Name: User user_parentalpermissionfileid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "user_parentalpermissionfileid_foreign" FOREIGN KEY ("parentalPermissionFileId") REFERENCES "public"."File"("id");


--
-- Name: Vehicle vehicle_kind_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Vehicle"
    ADD CONSTRAINT "vehicle_kind_foreign" FOREIGN KEY ("kind") REFERENCES "public"."VehicleKind"("value");


--
-- Name: Vehicle vehicle_ownerid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: adlm
--

ALTER TABLE ONLY "public"."Vehicle"
    ADD CONSTRAINT "vehicle_ownerid_foreign" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id");


--
-- PostgreSQL database dump complete
--

