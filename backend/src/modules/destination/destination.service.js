import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const createDestination = async (data) => {
  const existing = await prisma.destination.findUnique({
    where: {
      slug: data.slug
    }
  });

  if (existing) {
    throw new AppError(
      "Destination slug already exists.",
      409
    );
  }

  return prisma.$transaction(async (tx) => {
    const destination = await tx.destination.create({
      data: {
        categoryId: data.categoryId,
        countryId: data.countryId,
        cityId: data.cityId,
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        heroImage: data.heroImage,
        price: data.price,
        duration: data.duration,
        rating: data.rating,
        featured: data.featured,
        maxGuests: data.maxGuests,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        cancellationPolicy: data.cancellationPolicy,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        displayOrder: data.displayOrder,
        isPublished: data.isPublished
      }
    });

    if (data.gallery.length) {
      await tx.destinationImage.createMany({
        data: data.gallery.map((image) => ({
          destinationId: destination.id,
          image
        }))
      });
    }

    if (data.amenities.length) {
      await tx.destinationAmenity.createMany({
        data: data.amenities.map((amenityId) => ({
          destinationId: destination.id,
          amenityId
        }))
      });
    }

    if (data.highlights.length) {
      await tx.destinationHighlight.createMany({
        data: data.highlights.map((title) => ({
          destinationId: destination.id,
          title
        }))
      });
    }

    if (data.itinerary.length) {
      await tx.itinerary.createMany({
        data: data.itinerary.map((item) => ({
          destinationId: destination.id,
          day: item.day,
          title: item.title,
          description: item.description
        }))
      });
    }

    return destination;
  });
};

export const getDestinations = async () => {
  return prisma.destination.findMany({
    where: {
      isPublished: true
    },
    include: {
      category: true,
      country: true,
      city: true,
      images: true,
      reviews: {
        where: {
          isHidden: false
        },
        select: {
          rating: true
        }
      }
    },
    orderBy: [
      {
        displayOrder: "asc"
      },
      {
        createdAt: "desc"
      }
    ]
  });
};

export const getAdminDestinationById = async (id) => {
  const destination = await prisma.destination.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      category: true,
      country: true,
      city: true,
      images: true,
      itineraries: true,
      amenities: {
        include: {
          amenity: true
        }
      },
      highlights: true
    }
  });

  if (!destination) {
    throw new AppError(
      "Destination not found.",
      404
    );
  }

  return destination;
};

export const getDestinationBySlug = async (slug) => {
  const destination = await prisma.destination.findUnique({
    where: {
      slug
    },
    include: {
      category: true,
      country: true,
      city: true,
      images: true,
      itineraries: true,
      amenities: {
        include: {
          amenity: true
        }
      },
      highlights: true,
      reviews: {
        where: {
          isHidden: false
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  if (!destination) {
    throw new AppError(
      "Destination not found.",
      404
    );
  }

  return destination;
};

export const updateDestination = async (
  id,
  data
) => {
  const destination = await prisma.destination.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!destination) {
    throw new AppError(
      "Destination not found.",
      404
    );
  }

  if (
    data.slug &&
    data.slug !== destination.slug
  ) {
    const slugExists = await prisma.destination.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id: Number(id)
        }
      }
    });

    if (slugExists) {
      throw new AppError(
        "Destination slug already exists.",
        409
      );
    }
  }

  return prisma.$transaction(async (tx) => {
    const updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (
        ![
          "gallery",
          "amenities",
          "highlights",
          "itinerary"
        ].includes(key) &&
        value !== undefined
      ) {
        updateData[key] = value;
      }
    });

    await tx.destination.update({
      where: {
        id: Number(id)
      },
      data: updateData
    });

    if (data.gallery) {
      await tx.destinationImage.deleteMany({
        where: {
          destinationId: Number(id)
        }
      });

      if (data.gallery.length) {
        await tx.destinationImage.createMany({
          data: data.gallery.map((image) => ({
            destinationId: Number(id),
            image
          }))
        });
      }
    }

    if (data.amenities) {
      await tx.destinationAmenity.deleteMany({
        where: {
          destinationId: Number(id)
        }
      });

      if (data.amenities.length) {
        await tx.destinationAmenity.createMany({
          data: data.amenities.map((amenityId) => ({
            destinationId: Number(id),
            amenityId
          }))
        });
      }
    }

    if (data.highlights) {
      await tx.destinationHighlight.deleteMany({
        where: {
          destinationId: Number(id)
        }
      });

      if (data.highlights.length) {
        await tx.destinationHighlight.createMany({
          data: data.highlights.map((title) => ({
            destinationId: Number(id),
            title
          }))
        });
      }
    }

    if (data.itinerary) {
      await tx.itinerary.deleteMany({
        where: {
          destinationId: Number(id)
        }
      });

      if (data.itinerary.length) {
        await tx.itinerary.createMany({
          data: data.itinerary.map((item) => ({
            destinationId: Number(id),
            day: item.day,
            title: item.title,
            description: item.description
          }))
        });
      }
    }

    return tx.destination.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        images: true,
        highlights: true,
        itineraries: true,
        amenities: true
      }
    });
  });
};

export const deleteDestination = async (id) => {
  const destination = await prisma.destination.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!destination) {
    throw new AppError(
      "Destination not found.",
      404
    );
  }

  return prisma.$transaction(async (tx) => {
    await tx.destinationImage.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.destinationAmenity.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.destinationHighlight.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.itinerary.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.review.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.booking.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.wishlist.deleteMany({
      where: {
        destinationId: Number(id)
      }
    });

    await tx.destination.delete({
      where: {
        id: Number(id)
      }
    });

    return true;
  });
};
export const getAdminDestinations = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search
        }
      },
      {
        slug: {
          contains: query.search
        }
      }
    ];
  }

  if (query.categoryId) {
    where.categoryId = Number(query.categoryId);
  }

  if (query.countryId) {
    where.countryId = Number(query.countryId);
  }

  if (query.cityId) {
    where.cityId = Number(query.cityId);
  }

  if (query.featured !== undefined) {
    where.featured = query.featured === "true";
  }

  if (query.published !== undefined) {
    where.isPublished = query.published === "true";
  }

  const orderBy = {};

  switch (query.sort) {
    case "title_asc":
      orderBy.title = "asc";
      break;

    case "title_desc":
      orderBy.title = "desc";
      break;

    case "price_low":
      orderBy.price = "asc";
      break;

    case "price_high":
      orderBy.price = "desc";
      break;

    case "oldest":
      orderBy.createdAt = "asc";
      break;

    default:
      orderBy.createdAt = "desc";
  }

  const [items, totalItems] = await prisma.$transaction([
    prisma.destination.findMany({
      where,
      include: {
        category: true,
        country: true,
        city: true
      },
      skip,
      take: limit,
      orderBy
    }),

    prisma.destination.count({
      where
    })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};