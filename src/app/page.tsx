'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CountUp from 'react-countup';
import { 
  TreePine, 
  Brain, 
  Satellite, 
  MapPin, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Menu,
  X,
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Map,
  AlertCircle,
  Languages
} from 'lucide-react';

// Translation object
const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      features: 'Impact',
      faq: 'FAQ',
      contact: 'Contact',
      login: 'Login'
    },
    hero: {
      title: 'Empower Forest Rights with',
      titleHighlight: 'AI Innovation',
      description: 'Digitize records, map assets via satellite, visualize claims interactively, and deliver targeted welfare schemes for efficient FRA implementation.',
      getStarted: 'Get Started'
    },
    about: {
      title: 'About FRA-Mitra',
      description: 'FRA-Mitra is a comprehensive AI-powered platform that streamlines Forest Rights Act (FRA) claim management across India. Our innovative system combines artificial intelligence for digitization, satellite mapping for asset visualization, WebGIS for interactive mapping, and intelligent Decision Support Systems for targeted scheme recommendations.'
    },
    features: {
      ai: {
        title: 'AI-Powered Digitization',
        description: 'Transform legacy FRA documents into structured digital records using advanced OCR and NER technologies for efficient data extraction and management.'
      },
      atlas: {
        title: 'The Living FRA Atlas',
        description: 'Interactive WebGIS platform providing real-time visualization of FRA claims, forest areas, and tribal communities across India with dynamic mapping capabilities.'
      },
      satellite: {
        title: 'Satellite-to-Asset Mapping',
        description: 'Leverage high-resolution satellite imagery and AI classification to map forest assets, land use patterns, and environmental changes for comprehensive monitoring.'
      },
      dss: {
        title: 'Intelligent Scheme Delivery',
        description: 'AI-driven Decision Support System that analyzes beneficiary data and recommends targeted welfare schemes for optimal FRA implementation outcomes.'
      }
    },
    stats: {
      title: 'Key FRA Statistics',
      subtitle: 'Insights from our nationwide data-driven platform, highlighting the impact and challenges.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about FRA-Mitra'
    },
    cta: {
      title: 'Ready to Transform FRA Implementation?',
      subtitle: 'Join policymakers, NGOs, and communities in revolutionizing forest rights management',
      startJourney: 'Start Your Journey',
      contactUs: 'Contact Us'
    },
    footer: {
      description: 'Empowering forest rights through AI innovation and comprehensive digital solutions.',
      platform: 'Platform',
      resources: 'Resources',
      contact: 'Contact',
      copyright: '© 2024 FRA-Mitra. All rights reserved. Built for Forest Rights Act monitoring and tribal community support.',
      support: 'Research supported by Ministry of Tribal Affairs, Government of India'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      about: 'के बारे में',
      features: 'विशेषताएं',
      faq: 'सामान्य प्रश्न',
      contact: 'संपर्क',
      login: 'लॉगिन'
    },
    hero: {
      title: 'वन अधिकारों को सशक्त बनाएं',
      titleHighlight: 'AI नवाचार के साथ',
      description: 'रिकॉर्ड डिजिटाइज़ करें, उपग्रह के माध्यम से संपत्ति मैप करें, दावों को इंटरैक्टिव रूप से विज़ुअलाइज़ करें, और कुशल FRA कार्यान्वयन के लिए लक्षित कल्याण योजनाएं प्रदान करें।',
      getStarted: 'शुरू करें'
    },
    about: {
      title: 'FRA-मित्र के बारे में',
      description: 'FRA-मित्र एक व्यापक AI-संचालित प्लेटफॉर्म है जो भारत भर में वन अधिकार अधिनियम (FRA) दावा प्रबंधन को सुव्यवस्थित करता है। हमारी नवीन प्रणाली डिजिटलीकरण के लिए कृत्रिम बुद्धिमत्ता, संपत्ति विज़ुअलाइज़ेशन के लिए उपग्रह मैपिंग, इंटरैक्टिव मैपिंग के लिए WebGIS, और लक्षित योजना सिफारिशों के लिए बुद्धिमान निर्णय समर्थन प्रणाली को जोड़ती है।'
    },
    features: {
      ai: {
        title: 'AI-संचालित डिजिटलीकरण',
        description: 'कुशल डेटा निष्कर्षण और प्रबंधन के लिए उन्नत OCR और NER तकनीकों का उपयोग करके पुराने FRA दस्तावेजों को संरचित डिजिटल रिकॉर्ड में बदलें।'
      },
      atlas: {
        title: 'लिविंग FRA एटलस',
        description: 'इंटरैक्टिव WebGIS प्लेटफॉर्म जो भारत भर में FRA दावों, वन क्षेत्रों और आदिवासी समुदायों की वास्तविक समय विज़ुअलाइज़ेशन प्रदान करता है।'
      },
      satellite: {
        title: 'उपग्रह-से-संपत्ति मैपिंग',
        description: 'वन संपत्ति, भूमि उपयोग पैटर्न और पर्यावरणीय परिवर्तनों को मैप करने के लिए उच्च-रिज़ॉल्यूशन उपग्रह इमेजरी और AI वर्गीकरण का लाभ उठाएं।'
      },
      dss: {
        title: 'बुद्धिमान योजना वितरण',
        description: 'AI-संचालित निर्णय समर्थन प्रणाली जो लाभार्थी डेटा का विश्लेषण करती है और इष्टतम FRA कार्यान्वयन परिणामों के लिए लक्षित कल्याण योजनाओं की सिफारिश करती है।'
      }
    },
    stats: {
      title: 'मुख्य FRA आंकड़े',
      subtitle: 'हमारे राष्ट्रव्यापी डेटा-संचालित प्लेटफॉर्म से अंतर्दृष्टि, प्रभाव और चुनौतियों को उजागर करती है।'
    },
    faq: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      subtitle: 'FRA-मित्र के बारे में सामान्य प्रश्नों के उत्तर खोजें'
    },
    cta: {
      title: 'FRA कार्यान्वयन को बदलने के लिए तैयार हैं?',
      subtitle: 'वन अधिकार प्रबंधन में क्रांति लाने के लिए नीति निर्माताओं, गैर-सरकारी संगठनों और समुदायों के साथ जुड़ें',
      startJourney: 'अपनी यात्रा शुरू करें',
      contactUs: 'हमसे संपर्क करें'
    },
    footer: {
      description: 'AI नवाचार और व्यापक डिजिटल समाधानों के माध्यम से वन अधिकारों को सशक्त बनाना।',
      platform: 'प्लेटफॉर्म',
      resources: 'संसाधन',
      contact: 'संपर्क',
      copyright: '© 2024 FRA-मित्र। सभी अधिकार सुरक्षित। वन अधिकार अधिनियम निगरानी और आदिवासी समुदाय समर्थन के लिए निर्मित।',
      support: 'भारत सरकार के जनजातीय कार्य मंत्रालय द्वारा समर्थित अनुसंधान'
    }
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      about: 'विषयी',
      features: 'वैशिष्ट्ये',
      faq: 'सामान्य प्रश्न',
      contact: 'संपर्क',
      login: 'लॉगिन'
    },
    hero: {
      title: 'वन अधिकार सक्षम करा',
      titleHighlight: 'AI नवाचारासह',
      description: 'रेकॉर्ड डिजिटाइझ करा, उपग्रहाद्वारे मालमत्ता मॅप करा, दावे इंटरॅक्टिव्हपणे विज्युअलाइझ करा, आणि कार्यक्षम FRA अंमलबजावणीसाठी लक्षित कल्याण योजना पुरवा.',
      getStarted: 'सुरु करा'
    },
    about: {
      title: 'FRA-मित्र बद्दल',
      description: 'FRA-मित्र हे एक व्यापक AI-चालित प्लॅटफॉर्म आहे जे भारतभर वन अधिकार कायदा (FRA) दावा व्यवस्थापन सुव्यवस्थित करते. आमची नाविन्यपूर्ण प्रणाली डिजिटलीकरणासाठी कृत्रिम बुद्धिमत्ता, मालमत्ता विज्युअलायझेशनसाठी उपग्रह मॅपिंग, इंटरॅक्टिव्ह मॅपिंगसाठी WebGIS, आणि लक्षित योजना शिफारसीसाठी बुद्धिमान निर्णय समर्थन प्रणाली एकत्र करते.'
    },
    features: {
      ai: {
        title: 'AI-चालित डिजिटलीकरण',
        description: 'कार्यक्षम डेटा काढणे आणि व्यवस्थापनासाठी प्रगत OCR आणि NER तंत्रज्ञान वापरून जुने FRA दस्तावेज संरचित डिजिटल रेकॉर्डमध्ये रूपांतरित करा.'
      },
      atlas: {
        title: 'लिव्हिंग FRA एटलस',
        description: 'इंटरॅक्टिव्ह WebGIS प्लॅटफॉर्म जे भारतभर FRA दावे, वन क्षेत्रे आणि आदिवासी समुदायांचे रिअल-टाइम विज्युअलायझेशन प्रदान करते.'
      },
      satellite: {
        title: 'उपग्रह-ते-मालमत्ता मॅपिंग',
        description: 'वन मालमत्ता, जमीन वापर पॅटर्न आणि पर्यावरणीय बदल मॅप करण्यासाठी उच्च-रिझॉल्यूशन उपग्रह प्रतिमा आणि AI वर्गीकरणाचा फायदा घ्या.'
      },
      dss: {
        title: 'बुद्धिमान योजना वितरण',
        description: 'AI-चालित निर्णय समर्थन प्रणाली जी लाभार्थी डेटाचे विश्लेषण करते आणि इष्टतम FRA अंमलबजावणी परिणामांसाठी लक्षित कल्याण कार्यक्रमांची शिफारस करते.'
      }
    },
    stats: {
      title: 'मुख्य FRA आकडेवारी',
      subtitle: 'आमच्या राष्ट्रव्यापी डेटा-चालित प्लॅटफॉर्ममधून अंतर्दृष्टी, प्रभाव आणि आव्हाने उजागर करतात.'
    },
    faq: {
      title: 'वारंवार विचारले जाणारे प्रश्न',
      subtitle: 'FRA-मित्र बद्दल सामान्य प्रश्नांची उत्तरे शोधा'
    },
    cta: {
      title: 'FRA अंमलबजावणी बदलण्यासाठी तयार आहात?',
      subtitle: 'वन अधिकार व्यवस्थापनात क्रांती आणण्यासाठी धोरणकर्ते, गैर-सरकारी संस्था आणि समुदायांसोबत सामील व्हा',
      startJourney: 'आपली प्रवास सुरु करा',
      contactUs: 'आमच्याशी संपर्क साधा'
    },
    footer: {
      description: 'AI नवाचार आणि व्यापक डिजिटल उपायांद्वारे वन अधिकार सक्षम करणे.',
      platform: 'प्लॅटफॉर्म',
      resources: 'संसाधने',
      contact: 'संपर्क',
      copyright: '© 2024 FRA-मित्र. सर्व हक्क सुरक्षित. वन अधिकार कायदा निरीक्षण आणि आदिवासी समुदाय समर्थनासाठी तयार केले.',
      support: 'भारत सरकारच्या जमातीय कार्य मंत्रालयाद्वारे समर्थित संशोधन'
    }
  },
  as: {
    nav: {
      home: 'মূল পৃষ্ঠা',
      about: 'আমাৰ বিষয়ে',
      features: 'বৈশিষ্ট্যসমূহ',
      faq: 'সাধাৰণ প্ৰশ্ন',
      contact: 'যোগাযোগ',
      login: 'লগইন'
    },
    hero: {
      title: 'বন অধিকাৰক শক্তিশালী কৰক',
      titleHighlight: 'AI উদ্ভাৱনৰ সৈতে',
      description: 'ৰেকৰ্ড ডিজিটাইজ কৰক, উপগ্ৰহৰ জৰিয়তে সম্পত্তি মেপ কৰক, দাবীসমূহ ইন্টাৰেক্টিভভাৱে ভিজুৱেলাইজ কৰক, আৰু কাৰ্যকৰী FRA বাস্তৱায়নৰ বাবে লক্ষ্যযুক্ত কল্যাণ প্রকল্পসমূহ প্ৰদান কৰক।',
      getStarted: 'আৰম্ভ কৰক'
    },
    about: {
      title: 'FRA-মিত্ৰৰ বিষয়ে',
      description: 'FRA-মিত্ৰ হৈছে এটা ব্যাপক AI-চালিত প্লেটফৰ্ম যিয়ে ভাৰতজুৰি বন অধিকাৰ আইন (FRA) দাবী ব্যৱস্থাপনা সুবিন্যস্ত কৰে। আমাৰ উদ্ভাৱনী ব্যৱস্থাই ডিজিটেলাইজেচনৰ বাবে কৃত্ৰিম বুদ্ধিমত্তা, সম্পত্তি ভিজুৱেলাইজেচনৰ বাবে উপগ্ৰহ মেপিং, ইন্টাৰেক্টিভ মেপিংৰ বাবে WebGIS, আৰু লক্ষ্যযুক্ত প্রকল্পৰ পৰামৰ্শৰ বাবে বুদ্ধিমান সিদ্ধান্ত সমৰ্থন ব্যৱস্থা একত্ৰিত কৰে।'
    },
    features: {
      ai: {
        title: 'AI-চালিত ডিজিটেলাইজেচন',
        description: 'কাৰ্যকৰী ডেটা নিষ্কাশন আৰু ব্যৱস্থাপনাৰ বাবে উন্নত OCR আৰু NER প্ৰযুক্তি ব্যৱহাৰ কৰি পুৰণি FRA নথিপত্ৰসমূহক গঠনমূলক ডিজিটেল ৰেকৰ্ডলৈ ৰূপান্তৰ কৰক।'
      },
      atlas: {
        title: 'লিভিং FRA এটলাছ',
        description: 'ইন্টাৰেক্টিভ WebGIS প্লেটফৰ্ম যিয়ে ভাৰতজুৰি FRA দাবী, বন এলেকা, আৰু জনজাতীয় সম্প্ৰদায়ৰ ৰিয়েল-টাইম ভিজুৱেলাইজেচন প্ৰদান কৰে।'
      },
      satellite: {
        title: 'উপগ্ৰহ-থেকে-সম্পত্তি মেপিং',
        description: 'বন সম্পত্তি, ভূমি ব্যৱহাৰৰ ধৰণ, আৰু পৰিৱেশগত পৰিৱৰ্তন মেপ কৰিবলৈ উচ্চ-ৰিজলিউচন উপগ্ৰহ ইমেজাৰী আৰু AI শ্ৰেণীবিভাজনৰ সুবিধা লওক।'
      },
      dss: {
        title: 'বুদ্ধিমান প্রকল্প বিতৰণ',
        description: 'AI-চালিত সিদ্ধান্ত সমৰ্থন ব্যৱস্থা যিয়ে উপকৃত ব্যক্তিৰ ডেটা বিশ্লেষণ কৰে আৰু ইষ্টতম FRA বাস্তৱায়নৰ ফলাফলৰ বাবে লক্ষ্যযুক্ত কল্যাণ কাৰ্যসূচীৰ পৰামৰ্শ দিয়ে।'
      }
    },
    stats: {
      title: 'মুখ্য FRA পৰিসংখ্যা',
      subtitle: 'আমাৰ দেশব্যাপী ডেটা-চালিত প্লেটফৰ্মৰ পৰা অন্তৰ্দৃষ্টি, প্ৰভাৱ আৰু প্ৰত্যাহ্বানসমূহ উজ্জ্বল কৰে।'
    },
    faq: {
      title: 'সঘনাই সোধা প্ৰশ্নসমূহ',
      subtitle: 'FRA-মিত্ৰৰ বিষয়ে সাধাৰণ প্ৰশ্নসমূহৰ উত্তৰ বিচাৰক'
    },
    cta: {
      title: 'FRA বাস্তৱায়ন ৰূপান্তৰ কৰিবলৈ প্ৰস্তুত?',
      subtitle: 'বন অধিকাৰ ব্যৱস্থাপনাত বিপ্লৱ আনিবলৈ নীতি নিৰ্মাতা, এনজিঅ আৰু সম্প্ৰদায়ৰ সৈতে যোগদান কৰক',
      startJourney: 'আপোনাৰ যাত্ৰা আৰম্ভ কৰক',
      contactUs: 'আমাৰ সৈতে যোগাযোগ কৰক'
    },
    footer: {
      description: 'AI উদ্ভাৱন আৰু ব্যাপক ডিজিটেল সমাধানৰ জৰিয়তে বন অধিকাৰক শক্তিশালী কৰা।',
      platform: 'প্লেটফৰ্ম',
      resources: 'সম্পদ',
      contact: 'যোগাযোগ',
      copyright: '© 2024 FRA-মিত্ৰ। সকলো অধিকাৰ সংৰক্ষিত। বন অধিকাৰ আইন নিৰীক্ষণ আৰু জনজাতীয় সম্প্ৰদায়ৰ সমৰ্থনৰ বাবে নিৰ্মিত।',
      support: 'ভাৰত চৰকাৰৰ জনজাতীয় কাৰ্য মন্ত্ৰালয়ৰ দ্বাৰা সমৰ্থিত গৱেষণা'
    }
  },
  bn: {
    nav: {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      features: 'বৈশিষ্ট্য',
      faq: 'সাধারণ প্রশ্ন',
      contact: 'যোগাযোগ',
      login: 'লগইন'
    },
    hero: {
      title: 'বন অধিকারকে শক্তিশালী করুন',
      titleHighlight: 'AI উদ্ভাবনের সাথে',
      description: 'রেকর্ড ডিজিটাইজ করুন, উপগ্রহের মাধ্যমে সম্পত্তি ম্যাপ করুন, দাবিগুলো ইন্টারঅ্যাক্টিভভাবে ভিজ্যুয়ালাইজ করুন, এবং দক্ষ FRA বাস্তবায়নের জন্য লক্ষ্যযুক্ত কল্যাণ প্রকল্প সরবরাহ করুন।',
      getStarted: 'শুরু করুন'
    },
    about: {
      title: 'FRA-মিত্র সম্পর্কে',
      description: 'FRA-মিত্র একটি ব্যাপক AI-চালিত প্ল্যাটফর্ম যা ভারতজুড়ে বন অধিকার আইন (FRA) দাবি ব্যবস্থাপনা সুবিন্যস্ত করে। আমাদের উদ্ভাবনী সিস্টেম ডিজিটালাইজেশনের জন্য কৃত্রিম বুদ্ধিমত্তা, সম্পত্তি ভিজ্যুয়ালাইজেশনের জন্য উপগ্রহ ম্যাপিং, ইন্টারঅ্যাক্টিভ ম্যাপিংয়ের জন্য WebGIS, এবং লক্ষ্যযুক্ত প্রকল্পের সুপারিশের জন্য বুদ্ধিমান সিদ্ধান্ত সমর্থন সিস্টেম একত্রিত করে।'
    },
    features: {
      ai: {
        title: 'AI-চালিত ডিজিটালাইজেশন',
        description: 'দক্ষ ডেটা নিষ্কাশন এবং ব্যবস্থাপনার জন্য উন্নত OCR এবং NER প্রযুক্তি ব্যবহার করে পুরাতন FRA নথিপত্রকে গঠনমূলক ডিজিটাল রেকর্ডে রূপান্তর করুন।'
      },
      atlas: {
        title: 'লিভিং FRA অ্যাটলাস',
        description: 'ইন্টারঅ্যাক্টিভ WebGIS প্ল্যাটফর্ম যা ভারতজুড়ে FRA দাবি, বন এলাকা, এবং উপজাতীয় সম্প্রদায়ের রিয়েল-টাইম ভিজ্যুয়ালাইজেশন প্রদান করে।'
      },
      satellite: {
        title: 'উপগ্রহ-থেকে-সম্পত্তি ম্যাপিং',
        description: 'বন সম্পত্তি, ভূমি ব্যবহারের ধরণ, এবং পরিবেশগত পরিবর্তন ম্যাপ করার জন্য উচ্চ-রেজোলিউশন উপগ্রহ ইমেজারি এবং AI শ্রেণীবিভাজনের সুবিধা নিন।'
      },
      dss: {
        title: 'বুদ্ধিমান প্রকল্প বিতরণ',
        description: 'AI-চালিত সিদ্ধান্ত সমর্থন সিস্টেম যা উপকৃত ব্যক্তির ডেটা বিশ্লেষণ করে এবং ইষ্টতম FRA বাস্তবায়নের ফলাফলের জন্য লক্ষ্যযুক্ত কল্যাণ কর্মসূচির সুপারিশ দেয়।'
      }
    },
    stats: {
      title: 'মুখ্য FRA পরিসংখ্যা',
      subtitle: 'আমাদের দেশব্যাপী ডেটা-চালিত প্ল্যাটফর্ম থেকে অন্তর্দৃষ্টি, প্রভাব এবং চ্যালেঞ্জগুলো উজ্জ্বল করে।'
    },
    faq: {
      title: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
      subtitle: 'FRA-মিত্র সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন'
    },
    cta: {
      title: 'FRA বাস্তবায়ন রূপান্তর করতে প্রস্তুত?',
      subtitle: 'বন অধিকার ব্যবস্থাপনায় বিপ্লব আনতে নীতি নির্মাতা, এনজিও, এবং সম্প্রদায়ের সাথে যোগদান করুন',
      startJourney: 'আপনার যাত্রা শুরু করুন',
      contactUs: 'আমাদের সাথে যোগাযোগ করুন'
    },
    footer: {
      description: 'AI উদ্ভাবন এবং ব্যাপক ডিজিটাল সমাধানের মাধ্যমে বন অধিকারকে শক্তিশালী করা।',
      platform: 'প্ল্যাটফর্ম',
      resources: 'সম্পদ',
      contact: 'যোগাযোগ',
      copyright: '© 2024 FRA-মিত্র। সকল অধিকার সংরক্ষিত। বন অধিকার আইন নিরীক্ষণ এবং উপজাতীয় সম্প্রদায়ের সমর্থনের জন্য নির্মিত।',
      support: 'ভারত সরকারের উপজাতীয় কার্য মন্ত্রকের দ্বারা সমর্থিত গবেষণা'
    }
  },
  mni: {
    nav: {
      home: 'মূল পৃষ্ঠা',
      about: 'আমাৰ বিষয়ে',
      features: 'বৈশিষ্ট্যসমূহ',
      faq: 'সাধাৰণ প্ৰশ্ন',
      contact: 'যোগাযোগ',
      login: 'লগইন'
    },
    hero: {
      title: 'বন অধিকাৰক শক্তিশালী কৰক',
      titleHighlight: 'AI উদ্ভাৱনৰ সৈতে',
      description: 'ৰেকৰ্ড ডিজিটাইজ কৰক, উপগ্ৰহৰ জৰিয়তে সম্পত্তি মেপ কৰক, দাবীসমূহ ইন্টাৰেক্টিভভাৱে ভিজুৱেলাইজ কৰক, আৰু কাৰ্যকৰী FRA বাস্তৱায়নৰ বাবে লক্ষ্যযুক্ত কল্যাণ প্রকল্পসমূহ প্ৰদান কৰক।',
      getStarted: 'আৰম্ভ কৰক'
    },
    about: {
      title: 'FRA-মিত্ৰৰ বিষয়ে',
      description: 'FRA-মিত্ৰ হৈছে এটা ব্যাপক AI-চালিত প্লেটফৰ্ম যিয়ে ভাৰতজুৰি বন অধিকাৰ আইন (FRA) দাবী ব্যৱস্থাপনা সুবিন্যস্ত কৰে। আমাৰ উদ্ভাৱনী ব্যৱস্থাই ডিজিটেলাইজেচনৰ বাবে কৃত্ৰিম বুদ্ধিমত্তা, সম্পত্তি ভিজুৱেলাইজেচনৰ বাবে উপগ্ৰহ মেপিং, ইন্টাৰেক্টিভ মেপিংৰ বাবে WebGIS, আৰু লক্ষ্যযুক্ত প্রকল্পৰ পৰামৰ্শৰ বাবে বুদ্ধিমান সিদ্ধান্ত সমৰ্থন ব্যৱস্থা একত্ৰিত কৰে।'
    },
    features: {
      ai: {
        title: 'AI-চালিত ডিজিটেলাইজেচন',
        description: 'কাৰ্যকৰী ডেটা নিষ্কাশন আৰু ব্যৱস্থাপনাৰ বাবে উন্নত OCR আৰু NER প্ৰযুক্তি ব্যৱহাৰ কৰি পুৰণি FRA নথিপত্ৰসমূহক গঠনমূলক ডিজিটেল ৰেকৰ্ডলৈ ৰূপান্তৰ কৰক।'
      },
      atlas: {
        title: 'লিভিং FRA এটলাছ',
        description: 'ইন্টাৰেক্টিভ WebGIS প্লেটফৰ্ম যিয়ে ভাৰতজুৰি FRA দাবী, বন এলেকা, আৰু জনজাতীয় সম্প্ৰদায়ৰ ৰিয়েল-টাইম ভিজুৱেলাইজেচন প্ৰদান কৰে।'
      },
      satellite: {
        title: 'উপগ্ৰহ-থেকে-সম্পত্তি মেপিং',
        description: 'বন সম্পত্তি, ভূমি ব্যৱহাৰৰ ধৰণ, আৰু পৰিৱেশগত পৰিৱৰ্তন মেপ কৰিবলৈ উচ্চ-ৰিজলিউচন উপগ্ৰহ ইমেজাৰী আৰু AI শ্ৰেণীবিভাজনৰ সুবিধা লওক।'
      },
      dss: {
        title: 'বুদ্ধিমান প্রকল্প বিতৰণ',
        description: 'AI-চালিত সিদ্ধান্ত সমৰ্থন ব্যৱস্থা যিয়ে উপকৃত ব্যক্তিৰ ডেটা বিশ্লেষণ কৰে আৰু ইষ্টতম FRA বাস্তৱায়নৰ ফলাফলৰ বাবে লক্ষ্যযুক্ত কল্যাণ কাৰ্যসূচীৰ পৰামৰ্শ দিয়ে।'
      }
    },
    stats: {
      title: 'মুখ্য FRA পৰিসংখ্যা',
      subtitle: 'আমাৰ দেশব্যাপী ডেটা-চালিত প্লেটফৰ্মৰ পৰা অন্তৰ্দৃষ্টি, প্ৰভাৱ আৰু প্ৰত্যাহ্বানসমূহ উজ্জ্বল কৰে।'
    },
    faq: {
      title: 'সঘনাই সোধা প্ৰশ্নসমূহ',
      subtitle: 'FRA-মিত্ৰৰ বিষয়ে সাধাৰণ প্ৰশ্নসমূহৰ উত্তৰ বিচাৰক'
    },
    cta: {
      title: 'FRA বাস্তৱায়ন ৰূপান্তৰ কৰিবলৈ প্ৰস্তুত?',
      subtitle: 'বন অধিকাৰ ব্যৱস্থাপনাত বিপ্লৱ আনিবলৈ নীতি নিৰ্মাতা, এনজিঅ আৰু সম্প্ৰদায়ৰ সৈতে যোগদান কৰক',
      startJourney: 'আপোনাৰ যাত্ৰা আৰম্ভ কৰক',
      contactUs: 'আমাৰ সৈতে যোগাযোগ কৰক'
    },
    footer: {
      description: 'AI উদ্ভাৱন আৰু ব্যাপক ডিজিটেল সমাধানৰ জৰিয়তে বন অধিকাৰক শক্তিশালী কৰা।',
      platform: 'প্লেটফৰ্ম',
      resources: 'সম্পদ',
      contact: 'যোগাযোগ',
      copyright: '© 2024 FRA-মিত্ৰ। সকলো অধিকাৰ সংৰক্ষিত। বন অধিকাৰ আইন নিৰীক্ষণ আৰু জনজাতীয় সম্প্ৰদায়ৰ সমৰ্থনৰ বাবে নিৰ্মিত।',
      support: 'ভাৰত চৰকাৰৰ জনজাতীয় কাৰ্য মন্ত্ৰালয়ৰ দ্বাৰা সমৰ্থিত গৱেষণা'
    }
  }
};

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'mr' | 'as' | 'bn' | 'mni'>('en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [autoRotateLanguage, setAutoRotateLanguage] = useState<'en' | 'hi' | 'mr' | 'as' | 'bn' | 'mni'>('en');

  const heroImages = [
    '/image1.jpg',
    '/image2.jpg', 
    '/image3.jpg',
    '/image4.jpg'
  ];

  const features = [
    {
      icon: Brain,
      key: 'ai'
    },
    {
      icon: MapPin,
      key: 'atlas'
    },
    {
      icon: Satellite,
      key: 'satellite'
    },
    {
      icon: Settings,
      key: 'dss'
    }
  ];

  const faqData = [
    {
      question: 'How does FRA-Mitra digitize legacy records?',
      answer: 'FRA-Mitra uses advanced OCR (Optical Character Recognition) and NER (Named Entity Recognition) technologies to automatically extract structured data from scanned FRA documents, converting them into searchable digital records with high accuracy.'
    },
    {
      question: 'What satellite data is used for asset mapping?',
      answer: 'We utilize high-resolution satellite imagery from multiple sources including Landsat, Sentinel, and commercial satellites to map forest areas, land use patterns, water bodies, and infrastructure changes over time.'
    },
    {
      question: 'How does the DSS recommend schemes?',
      answer: 'Our Decision Support System analyzes beneficiary data, geographic conditions, and available schemes to provide intelligent recommendations. It considers factors like water scarcity, agricultural needs, and community requirements to suggest the most appropriate welfare programs.'
    },
    {
      question: 'Is FRA-Mitra accessible to tribal communities?',
      answer: 'Yes, FRA-Mitra is designed with accessibility in mind. We provide multilingual support, simplified interfaces, and community-friendly features to ensure tribal communities can easily access and benefit from the platform.'
    },
    {
      question: 'How secure is the data in FRA-Mitra?',
      answer: 'FRA-Mitra implements enterprise-grade security measures including data encryption, secure authentication, and compliance with Indian data protection regulations to ensure all sensitive information is protected.'
    },
    {
      question: 'Can NGOs and policymakers access the platform?',
      answer: 'Absolutely. FRA-Mitra offers different access levels for NGOs, policymakers, government officials, and community representatives, each with appropriate permissions and tools for their specific needs.'
    }
  ];

  const statsData = [
    {
      title: 'Total Claims Filed',
      stat: '5.12M Claims Unlocked',
      description: 'Highlight the massive scale of FRA claims digitized for transparency.',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Approval Rate',
      stat: '49% Rights Secured',
      description: 'Emphasize the portion of successful claims, urging for better efficiency.',
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'Tribal Population Affected',
      stat: '104.2M Lives Impacted',
      description: 'Showcase the vast community relying on your solution for support.',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Rejection Rate',
      stat: '36.35% Denials Addressed',
      description: 'Draw attention to the challenge your AI digitization aims to reduce.',
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Land Vested',
      stat: '190.39M Acres Mapped',
      description: 'Celebrate the land area now linked to owners via satellite mapping.',
      icon: Map,
      color: 'orange'
    },
    {
      title: 'Forest Cover Baseline',
      stat: '7.15M sq km Protected',
      description: 'Highlight the environmental scope your WebGIS atlas monitors.',
      icon: Globe,
      color: 'teal'
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate headline languages
  useEffect(() => {
    const languages: ('en' | 'hi' | 'mr' | 'as' | 'bn' | 'mni')[] = ['en', 'hi', 'mr', 'as', 'bn', 'mni'];
    const interval = setInterval(() => {
      setAutoRotateLanguage((prevLang) => {
        const currentIndex = languages.indexOf(prevLang);
        return languages[(currentIndex + 1) % languages.length];
      });
    }, 2000); // Change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .section-title {
          font-family: 'Merriweather', serif;
          @apply text-5xl font-bold text-green-900;
        }

        .section-heading {
          @apply text-lg font-semibold text-gray-500 bg-gray-200 inline-block px-4 py-2 rounded-full;
        }

        .btn-primary {
          @apply bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1;
        }

        .btn-secondary {
          @apply border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl;
        }

        .btn-tertiary {
          @apply border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.07);
        }

        h2 {
          @apply text-3xl font-bold text-gray-900 mb-4;
        }

        .subtitle {
          @apply text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed;
        }

        .animate-fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Image 
                  src="/logo.png" 
                  alt="FRA-Mitra Logo" 
                  width={24} 
                  height={24} 
                  className="h-6 w-6"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">FRA-Mitra</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {translations[currentLanguage].nav.home}
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {translations[currentLanguage].nav.about}
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {translations[currentLanguage].nav.features}
              </button>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {translations[currentLanguage].nav.faq}
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {translations[currentLanguage].nav.contact}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <Languages className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentLanguage === 'en' ? 'English' : 
                     currentLanguage === 'hi' ? 'हिन्दी' :
                     currentLanguage === 'mr' ? 'मराठी' :
                     currentLanguage === 'as' ? 'অসমীয়া' :
                     currentLanguage === 'bn' ? 'বাংলা' :
                     currentLanguage === 'mni' ? 'মৈতৈলোন্' : 'English'}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setCurrentLanguage('en');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'en' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLanguage('hi');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'hi' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLanguage('mr');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'mr' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      मराठी
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLanguage('as');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'as' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      অসমীয়া
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLanguage('bn');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'bn' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLanguage('mni');
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currentLanguage === 'mni' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      মৈতৈলোন্
                    </button>
                  </div>
                )}
              </div>
              
              <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                {translations[currentLanguage].nav.login}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left"
                >
                  {translations[currentLanguage].nav.home}
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left"
                >
                  {translations[currentLanguage].nav.about}
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left"
                >
                  {translations[currentLanguage].nav.features}
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left"
                >
                  {translations[currentLanguage].nav.faq}
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left"
                >
                  {translations[currentLanguage].nav.contact}
                </button>
                <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
                  {translations[currentLanguage].nav.login}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Forest background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="transition-all duration-500 ease-in-out">
              {translations[autoRotateLanguage].hero.title}{' '}
              <span className="text-green-400">{translations[autoRotateLanguage].hero.titleHighlight}</span>
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 leading-relaxed">
            {translations[currentLanguage].hero.description}
          </p>

          <div className="flex justify-center">
            <Link 
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {translations[currentLanguage].hero.getStarted}
            </Link>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-20 pb-16 bg-gray-50 flex justify-center">
        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="text-black text-3xl font-bold">{translations[currentLanguage].about.title}</h2>
            <p className="text-black text-lg mt-4 max-w-4xl mx-auto">
              {translations[currentLanguage].about.description}
            </p>
          </div>

          {/* Key Features Section with Expanded Width */}
        <section>
          <div className="max-w-screen-xl mx-auto">
            <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{translations[currentLanguage].features[feature.key as keyof typeof translations[typeof currentLanguage]['features']].title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{translations[currentLanguage].features[feature.key as keyof typeof translations[typeof currentLanguage]['features']].description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 text-center">
            <div className="p-10">
              <div className="text-4xl font-bold mb-2"><CountUp end={500} duration={2.5} enableScrollSpy />+</div>
              <div className="text-green-200">Claims Processed</div>
            </div>
            <div className="p-10">
              <div className="text-4xl font-bold mb-2"><CountUp end={25} duration={2.5} enableScrollSpy />+</div>
              <div className="text-green-200">Tribal Communities</div>
            </div>
            <div className="p-10">
              <div className="text-4xl font-bold mb-2"><CountUp end={15} duration={2.5} enableScrollSpy />+</div>
              <div className="text-green-200">Forest Areas Mapped</div>
            </div>
            <div className="p-10">
              <div className="text-4xl font-bold mb-2"><CountUp end={95} duration={2.5} enableScrollSpy />%</div>
              <div className="text-green-200">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key FRA Statistics Section */}
      <section id="statistics" className="pt-20 pb-16 bg-white flex justify-center">
        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12">
             <div className="text-center mb-8">
             <h2 className="text-black text-3xl font-bold">{translations[currentLanguage].stats.title}</h2>
             <p className="text-black text-lg mt-4 max-w-4xl mx-auto">
                {translations[currentLanguage].stats.subtitle}
              </p>
         </div> 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statsData.map((stat, index) => {
              const colorClasses = {
                blue: { border: 'border-blue-200', text: 'text-blue-600', title: 'text-blue-900' },
                green: { border: 'border-green-200', text: 'text-green-600', title: 'text-green-900' },
                purple: { border: 'border-purple-200', text: 'text-purple-600', title: 'text-purple-900' },
                red: { border: 'border-red-200', text: 'text-red-600', title: 'text-red-900' },
                orange: { border: 'border-orange-200', text: 'text-orange-600', title: 'text-orange-900' },
                teal: { border: 'border-teal-200', text: 'text-teal-600', title: 'text-teal-900' },
              };
              const classes = colorClasses[stat.color as keyof typeof colorClasses];
              const [statVal, ...statTextParts] = stat.stat.split(' ');
              const statText = statTextParts.join(' ');
              
              return (
                <div key={index} className={`bg-white p-6 rounded-xl border ${classes.border} flex flex-col card-hover transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  <div className="flex items-center text-sm font-semibold mb-3">
                    <stat.icon className={`h-5 w-5 mr-2 ${classes.text}`} />
                    <span className={classes.title}>{stat.title}</span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-800 mb-1">{statVal}</p>
                    <p className="text-gray-500 font-medium text-sm mb-3 h-5">{statText}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{stat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pt-20 pb-16 bg-gray-50 flex justify-center">
        <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
         <div className="text-center mb-8">
           <h2 className="text-black text-3xl font-bold">{translations[currentLanguage].faq.title}</h2>
             <p className="text-black text-lg mt-4 max-w-3xl mx-auto">
              {translations[currentLanguage].faq.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors rounded-xl"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pt-20 pb-16 bg-white flex justify-center">
        <div className="w-full max-w-4xl text-center px-6 sm:px-8 lg:px-12">
          <h2 className="text-black text-3xl font-bold">
            {translations[currentLanguage].cta.title}
          </h2>
          <p className="text-black text-lg mt-4 mb-8 max-w-3xl mx-auto">
            {translations[currentLanguage].cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="btn-primary"
            >
              {translations[currentLanguage].cta.startJourney}
            </Link>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-tertiary"
            >
              {translations[currentLanguage].cta.contactUs}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 flex justify-center">
        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="FRA-Mitra Logo" 
                  width={24} 
                  height={24} 
                  className="h-6 w-6"
                />
                <span className="text-xl font-bold">FRA-Mitra</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {translations[currentLanguage].footer.description}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{translations[currentLanguage].footer.platform}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-left">{translations[currentLanguage].nav.features}</button></li>
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-left">{translations[currentLanguage].nav.about}</button></li>
                <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-left">{translations[currentLanguage].nav.faq}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{translations[currentLanguage].footer.resources}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{translations[currentLanguage].footer.contact}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@fra-mitra.org</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91-XXX-XXXX-XXXX</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>{translations[currentLanguage].footer.copyright}</p>
            <p className="mt-2">
              {translations[currentLanguage].footer.support}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}